import { useState } from "react";
import { BarChart3, Check, Loader2 } from "lucide-react";
import { votePoll, type PostPollData } from "../api";
import { toast } from "react-toastify";

interface PollProps {
  postId: string;
  initialPoll: PostPollData;
}

const Poll: React.FC<PollProps> = ({ postId, initialPoll }) => {
  const [poll, setPoll] = useState<PostPollData>(initialPoll);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    initialPoll.user_voted_option_id ?? null
  );
  const [isVoting, setIsVoting] = useState(false);

  // Keep local state in sync if the parent feed refreshes.
  // (Simple prop-sync without useEffect loop: update when postId changes is handled by key.)
  const hasVoted = Boolean(poll.user_voted_option_id);
  const totalVotes = poll.total_votes ?? 0;

  const handleVote = async () => {
    if (!selectedOptionId) {
      toast.error("Pick an option to vote");
      return;
    }
    setIsVoting(true);
    try {
      const result = await votePoll(postId, selectedOptionId);
      if (result.data) {
        setPoll(result.data);
        setSelectedOptionId(result.data.user_voted_option_id ?? selectedOptionId);
        toast.success("Vote recorded");
      }
    } catch (err) {
      console.error("Error voting in poll", err);
      toast.error("Failed to record vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const percentOf = (votes: number) =>
    totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

  return (
    <div
      className="mt-3 border border-[#C9A86A]/60 bg-[#F5F5F0] p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-[#CC5A2A]" />
        <span className="text-sm font-semibold text-[#0A1931]">Poll</span>
        <span className="text-xs text-[#4d5666]">
          • {totalVotes} vote{totalVotes === 1 ? "" : "s"}
        </span>
      </div>

      {!hasVoted ? (
        <div className="space-y-2">
          {poll.options.map((opt) => {
            const selected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOptionId(opt.id)}
                className={[
                  "flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "border-[#0A1931] bg-[#0A1931] text-white"
                    : "border-[#0A1931]/20 bg-white text-[#0A1931] hover:border-[#CC5A2A]",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    selected ? "border-white bg-white" : "border-[#0A1931]/40",
                  ].join(" ")}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-[#0A1931]" />}
                </span>
                <span className="flex-1 font-medium">{opt.text}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleVote}
            disabled={!selectedOptionId || isVoting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-[#0A1931] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#CC5A2A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVoting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isVoting ? "Submitting..." : "Vote"}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {poll.options.map((opt) => {
            const pct = percentOf(opt.vote_count);
            const isMine = poll.user_voted_option_id === opt.id;
            return (
              <div
                key={opt.id}
                className={[
                  "relative overflow-hidden border px-3 py-2.5",
                  isMine ? "border-[#0A1931] bg-white" : "border-[#0A1931]/15 bg-white",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute inset-y-0 left-0 transition-all",
                    isMine ? "bg-[#C9A86A]/40" : "bg-[#0A1931]/10",
                  ].join(" ")}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-[#0A1931]">
                    {opt.text}
                    {isMine && (
                      <span className="inline-flex items-center gap-1 bg-[#0A1931] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        <Check className="h-3 w-3" /> Your vote
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[#4d5666]">
                    {pct}% • {opt.vote_count}
                  </span>
                </div>
              </div>
            );
          })}
          <p className="pt-1 text-xs text-[#4d5666]">
            {totalVotes} vote{totalVotes === 1 ? "" : "s"} total
            {poll.user_voted_option_id
              ? " • Tap an option below to change your vote in a future update."
              : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default Poll;
