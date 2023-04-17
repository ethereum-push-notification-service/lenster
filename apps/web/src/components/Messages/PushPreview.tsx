import type { FC } from 'react';

interface PreviewListProps {
  selectedConversationKey?: string;
}
const PushPreview: FC<PreviewListProps> = ({ selectedConversationKey }) => {
  return (
    <div className="flex h-full flex-col justify-between">
      show push conversations to redirect to push conversation page
    </div>
  );
};

export default PushPreview;
