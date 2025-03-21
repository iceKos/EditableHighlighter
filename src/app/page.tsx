import EditableHighlighter from '@/app/components/EditableHighlighter';

export default function Home() {
  const defaultTemplate = 'Hello {{name}}, your order {{orderId}} is ready!\nThanks, {{user}}.';

  return (
    <main style={{ padding: '2rem' }}>
      <EditableHighlighter template={defaultTemplate} />
    </main>
  );
}
