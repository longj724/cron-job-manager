// External Dependencies
import { ChakraProvider } from '@chakra-ui/react';

// Absolute Dependencies

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
