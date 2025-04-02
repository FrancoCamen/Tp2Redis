import { Routes, Route } from 'react-router-dom';
import ChapterList from './components/ChapterList';
import PaymentPage from './components/PaymentPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChapterList />} />
        <Route path="/pagar/:season/:episode" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
