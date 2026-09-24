import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/Home/HomePage';
import { CanvasEditor } from './components/Canvas/CanvasEditor';
import { ToastProvider } from './components/shared/Toast';

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
