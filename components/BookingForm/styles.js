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

export const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 12px;
  height: 30px;
  margin-left: ${({ plus }) => plus && '5px'};
  background-color: ${({ plus }) => !plus && '#7E92B5'};
  border-color: ${({ plus }) => !plus && '#65789B'};
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`;

export const ModalConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20;
`;

export const ModalConfirmStatisticContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
