import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

const PROMPT = `Generate 5-7 concise bullet points for a resume experience section based on this position title: {positionTitle}. 
Requirements:
- Only include the bullet points
- No explanations, headers, or titles
- without simple HTML <li> tags without <ul> or
- Avoid experience level mentions
- Focus on achievements and responsibilities`;

function formatWorkSummary(summary) {
  const points = summary.split(/",\s*"/);
  return points.map(point => point.replace(/"/g, '').trim());
}

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue || '');
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [summaryPoints, setSummaryPoints] = useState([]);

  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.Experience[index]?.title) {
      toast('Please Add Position Title');
      return;
    }
    setLoading(true);
    const prompt = PROMPT.replace('{positionTitle}', resumeInfo.Experience[index].title);

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const resp = result.response.text();
      const formattedPoints = formatWorkSummary(resp);
      setSummaryPoints(formattedPoints);
    } catch (error) {
      console.error('Error generating summary from AI:', error);
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handlePointClick = (point) => {
    const newValue = `${value}<li>${point}</li>`;
    setValue(newValue);
    onRichTextEditorChange({ target: { value: newValue } }, 'workSummery', index);
  };

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <>
              <Brain className='h-4 w-4' /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e, 'workSummery', index);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>

      {/* AI Generated Points Section */}
      {summaryPoints.length > 0 && (
        <div className="mt-4 p-2 border rounded">
          <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
          <ul className="list-disc pl-4">
            {summaryPoints.map((point, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-gray-100 p-1 rounded text-sm"
                onClick={() => handlePointClick(point)}
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;