import styled from 'styled-components';
import { Button } from 'antd';

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BookingButton = styled(Button)`
  margin-bottom: 20px;
  height: 100px;
  background-color: ${({ color }) => color};
  border-color: ${({ color }) => color};
`;
