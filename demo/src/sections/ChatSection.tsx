import {
  Conversation,
  ConversationContent,
} from "@/lib/chatbot/conversation";
import { Message, MessageContent } from "@/lib/chatbot/message";
import { Reasoning } from "@/lib/chatbot/reasoning";
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "@/lib/chatbot/sources";
import { CodeBlock } from "@/lib/chatbot/code-block";
import { Loader } from "@/lib/chatbot/loader";
import {
  Suggestions,
  SuggestionsList,
  SuggestionItem,
} from "@/lib/chatbot/suggestions";

const snippet = `import { Message, MessageContent } from "@/lib/chatbot/message";

export function Thread({ messages }) {
  return messages.map((m) => (
    <Message key={m.id} from={m.role}>
      <MessageContent>{m.text}</MessageContent>
    </Message>
  ));
}`;

export default function ChatSection() {
  return (
    <div className="space-y-6">
      <Conversation className="h-[460px] rounded-xl border border-border bg-card">
        <ConversationContent>
          <Message from="user">
            <MessageContent variant="user">
              Why does my agent keep re-planning the same step?
            </MessageContent>
          </Message>

          <Message from="assistant" timestamp="2026-11-05T08:20:00Z">
            <MessageContent>
              <Reasoning defaultOpen>
                The loop usually comes from a planner that has no memory of what
                it already executed. Check whether the step id is stable across
                turns.
              </Reasoning>

              <p className="mt-3">
                Two things to check: the step identity and the completion
                signal. If either is regenerated on every turn, the planner sees
                new work each time.
              </p>

              <div className="mt-3">
                <CodeBlock
                  code={snippet}
                  language="ts"
                  filename="thread.tsx"
                  showLineNumbers
                />
              </div>

              <div className="mt-3">
                <Sources>
                  <SourcesTrigger count={2} />
                  <SourcesContent>
                    <Source
                      href="https://react.dev/reference/react"
                      title="React reference"
                    />
                    <Source
                      href="https://www.anthropic.com/engineering/building-effective-agents"
                      title="Building effective agents"
                    />
                  </SourcesContent>
                </Sources>
              </div>
            </MessageContent>
          </Message>

          <Message from="assistant">
            <MessageContent>
              <Loader variant="dots" text="Checking your trace" />
            </MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>

      <Suggestions title="Follow-ups">
        <SuggestionsList>
          <SuggestionItem>Show me the step-id diff</SuggestionItem>
          <SuggestionItem>How do I persist planner memory?</SuggestionItem>
          <SuggestionItem>Add a retry budget</SuggestionItem>
        </SuggestionsList>
      </Suggestions>
    </div>
  );
}
