type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function QuestionInput({ value, onChange, disabled }: Props) {
  return (
    <div className="question-input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What troubles you, traveler?"
        maxLength={140}
        disabled={disabled}
        aria-label="Your question for the Oracle"
      />
    </div>
  );
}
