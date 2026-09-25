import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/Home/HomePage.tsx';
import { CanvasEditor } from './components/Canvas/CanvasEditor.tsx';
import { ToastProvider } from './components/shared/Toast.tsx';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas/:canvasId" element={<CanvasEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
