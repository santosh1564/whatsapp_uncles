import { findRelevantContent } from '@/lib/ai/embedding';
import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import z from 'zod';
import { createMCPClient } from '@ai-sdk/mcp';
import { env } from '@/lib/env.mjs';



// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const mcpClient = await createMCPClient({
    transport: {
      type: 'http',
      url: 'https://rube.app/mcp',
  
      
      // optional: configure HTTP headers
      headers: { Authorization: `Bearer ${env.RUBE_MCP_TOKEN}` },
  
      // optional: provide an OAuth client provider for automatic authorization
     // authProvider: myOAuthClientProvider,
    },
  });
  const tools = await mcpClient.tools();

  const result = streamText({
    //model: google('gemini-2.5-flash'),
    model: 'anthropic/claude-haiku-4.5',
    stopWhen: stepCountIs(20),
    tools: {
      ...tools,
     //  ...await mcpClient.tools()
/*      get_relevant_content: {
        description: "Get relevant content from the database",

        inputSchema: z.object({
          question: z
            .string()
            .describe(
              "The original normalized question to get relevant content for"
            ),
          similarPhrases: z
            .array(z.string())
            .describe(
              "Phrases similar to the question to cover more similarity score surface from the vector store."
            ),
        }),

        execute: async ({ question, similarPhrases }) => {
          const [_relevantContent, ...similarContent] = await Promise.all([
            findRelevantContent(question),
            ...similarPhrases.map(findRelevantContent),
          ]);

          const deduplicatedContent = [
            ...new Set([
              ..._relevantContent.map((_) => JSON.stringify(_)),
              ...similarContent.map((_) => JSON.stringify(_)),
            ]),
          ];

          return deduplicatedContent;
        },
      }, */
    //  google_search: google.tools.googleSearch({}),

    },

system: 

' You are a helpful AI assistant designed to help the people to find relevant content from the database. Use the tools provided to you to find the relevant content.  follow the instructions carefully and do not make up any information. respond in a valid markdown format.  when reporting the results to the User, be extremely concise and sacrifice some grammatical correctness for brevity.  provide direct actionable steps to the User with clear and concise language. provide some examples of the results to the User to help them understand the results. ',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
} 