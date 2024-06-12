import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ComingSoon from './components/ComingSoon';
import GlobalStyle from './styles/global';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<ComingSoon />} />
      </Routes>
    </Router>
  );
}

export default App;
