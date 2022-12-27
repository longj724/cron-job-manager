// External Dependencies
import { ChakraProvider } from '@chakra-ui/react';

// Relative Dependencies
import JobsPage from './JobsPage';

function App() {
  return (
    <ChakraProvider>
      <JobsPage />
    </ChakraProvider>
  );
}

export default App;
