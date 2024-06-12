import styled from 'styled-components';
import illustration from '../assets/coming-soon-illustration.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: auto;
  background: #f0f0f0;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Illustration = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3B71EB;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #333;
  }
`;

const ComingSoon = () => {
  const handleRedirect = () => {
    window.location.href = "https://souk-el-kotob-api.onrender.com/docs/";
  };

  return (
    <Container>
      <Illustration src={illustration} alt="Coming Soon Illustration" />
      <Title>Souk el Kotob</Title>
      <Subtitle>Coming Soon</Subtitle>
      <Button onClick={handleRedirect}>Check API Documentation</Button>
    </Container>
  );
};

export default ComingSoon;
