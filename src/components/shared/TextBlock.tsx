import React from "react";

interface TextBlockProps {
  title: string;
  paragraphs: string[];
}

const TextBlock: React.FC<TextBlockProps> = ({ title, paragraphs }) => {
  return (
    <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-2">{title}</p>
        {paragraphs.map((text, index) => (
          <p key={index} className={index > 0 ? "mt-2" : ""}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TextBlock;
