import { StreamingTextResponse, experimental_streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";

// Type definitions
type Metadata = {
  referenceURL: string;
  text: string;
};

type ScoredRecord = {
  id: string;
  score: number;
  metadata: Metadata;
};

/**
 * Handles the POST request for the chat route.
 * @param req - The request object.
 * @returns A StreamingTextResponse object containing the result of the chat interaction.
 * @throws An error if there's a problem with context generation or streaming.
 */
export async function POST(req: Request) {
  try {
    const { messages, namespaceId } = await req.json();

    // Generate context directly instead of calling external API
    const context = await createPrompt(messages, namespaceId);

    if (context && context.prompt && context.prompt.length > 0) {
      const systemContent = context.prompt[0].content;

      const result = await experimental_streamText({
        system: systemContent,
        temperature: 0.2,
        model: openai.chat("gpt-4-turbo"),
        maxRetries: 8,
        messages,
      });

      return new StreamingTextResponse(result.toAIStream());
    } else {
      throw new Error(
        "Failed to generate prompt: 'prompt' array is missing or empty."
      );
    }
  } catch (error) {
    console.error("Error processing chat request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Creates a prompt with context for the AI.
 * @param messages - The messages from the conversation.
 * @param namespaceId - The namespace ID for context retrieval.
 * @returns The prompt with context.
 */
async function createPrompt(messages: any[], namespaceId: string) {
  try {
    // Get the last message
    const lastMessage = messages[messages.length - 1]["content"];

    // Get the context from the last message
    const context = await getContext(lastMessage, namespaceId);

    const prompt = [
      {
        role: "system",
        content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      DO NOT SHARE REFERENCE URLS THAT ARE NOT INCLUDED IN THE CONTEXT BLOCK.
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      If user asks about or refers to the current "workspace" AI will refer to the the content after START CONTEXT BLOCK and before END OF CONTEXT BLOCK as the CONTEXT BLOCK. 
      If AI sees a REFERENCE URL in the provided CONTEXT BLOCK, please use reference that URL in your response as a link reference right next to the relevant information in a numbered link format e.g. ([reference number](link))
      If link is a pdf and you are CERTAIN of the page number, please include the page number in the pdf href (e.g. .pdf#page=x ).
      If AI is asked to give quotes, please bias towards providing reference links to the original source of the quote.
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation. It will say it does not know if the CONTEXT BLOCK is empty.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant will not answer questions that are not related to the context.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      `,
      },
    ];
    return { prompt };
  } catch (e) {
    console.error("Error creating prompt:", e);
    throw e;
  }
}

/**
 * Retrieves context for a given message using Pinecone REST API.
 * @param message - The message to get context for.
 * @param namespace - The namespace to search in.
 * @param maxCharacters - Maximum characters to return (default: 5000).
 * @param minScore - Minimum similarity score threshold (default: 0.15).
 * @param getOnlyText - Whether to return only text or full records (default: true).
 * @returns The context as string or records.
 */
async function getContext(
  message: string,
  namespace: string,
  maxCharacters = 5000,
  minScore = 0.15,
  getOnlyText = true
): Promise<string | ScoredRecord[]> {
  try {
    // Generate embeddings for the message
    const embeddings = await embedChunks([message]);

    // Extract the embedding from the response
    const embedding = embeddings[0].embedding;

    // Get matches from Pinecone
    const matches = await getMatchesFromEmbeddings(embedding, 15, namespace);
    const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

    if (!getOnlyText) {
      return qualifyingDocs;
    }

    // Deduplicate and get text
    const documentTexts = qualifyingDocs.map((match) => {
      const metadata = match.metadata as Metadata;
      return `REFERENCE URL: ${metadata.referenceURL} CONTENT: ${metadata.text}`;
    });

    // Concatenate, then truncate by maxCharacters
    const concatenatedDocs = documentTexts.join(" ");
    return concatenatedDocs.length > maxCharacters
      ? concatenatedDocs.substring(0, maxCharacters)
      : concatenatedDocs;
  } catch (error) {
    console.error("Failed to get context:", error);
    throw error;
  }
}

/**
 * Embed chunks of text using OpenAI's embedding model.
 * @param chunks - Array of text chunks to embed.
 * @returns Embedded representations of the chunks.
 */
async function embedChunks(chunks: string[]): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID,
  });

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
      encoding_format: "float",
      dimensions: 1536,
    });
    return response.data;
  } catch (error) {
    console.error("Error embedding text with OpenAI:", error);
    throw error;
  }
}

/**
 * Retrieves matches for given embeddings from Pinecone using the REST API.
 * @param embeddings - The embeddings to match against.
 * @param topK - Number of top matches to return.
 * @param namespace - The namespace to search in.
 * @returns Array of matched records with scores.
 */
async function getMatchesFromEmbeddings(
  embeddings: number[],
  topK: number,
  namespace: string
): Promise<ScoredRecord[]> {
  // Get index info from environment variables
  const indexName = process.env.PINECONE_INDEX_NAME || "";
  const apiKey = process.env.PINECONE_API_KEY || "";

  if (!indexName || !apiKey) {
    throw new Error("Missing required Pinecone environment variables");
  }

  // Construct the API URL - using modern Pinecone formatting
  const apiUrl = `https://sample-app-1-41rz9sc.svc.aped-4627-b74a.pinecone.io/query`;

  try {
    console.log(`Querying Pinecone at: ${apiUrl}`);

    // Use fetch API to call Pinecone directly (Edge compatible)
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Pinecone-API-Version": "2025-01",
      },
      body: JSON.stringify({
        vector: embeddings,
        topK,
        namespace,
        includeMetadata: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Pinecone API error: ${response.status} ${errorText}`);
      throw new Error(`Pinecone API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Transform Pinecone response to expected format
    return (result.matches || []).map((match: any) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }));
  } catch (e) {
    console.error("Error querying embeddings:", e);
    throw new Error(
      `Error querying embeddings: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}
