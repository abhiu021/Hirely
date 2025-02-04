// App.js or index.js
import { ResumeInfoProvider } from '@/context/ResumeInfoContext';

function App() {
    return (
        <ResumeInfoProvider>
            {/* Your other components */}
        </ResumeInfoProvider>
    );
}

export default App;