import styled from 'styled-components';

interface ModalProps {
  visible: boolean;
}

export const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Começa pelo topo, não mais centralizando verticalmente */
  padding: 20px;               /* Mantém um padding interno */
  width: 1000px;
  border-radius: 25px;
  /* REMOVIDA A ALTURA FIXA PARA DEIXAR O CONTAINER SE AJUSTAR AO TEXTO */
`;

export const Title = styled.h1`
  color: #0d47a1;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  .info-btn {
    background: none;
    border: none;
    color: #0d47a1;
    font-size: 1.5rem;
    margin-left: 10px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #3f51b5;
    }
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
`;

export const Textarea = styled.textarea`
  width: 900px;
  min-height: 200px;       /* Altura mínima */
  max-height: none;        /* Sem limite máximo */
  border-radius: 10px;
  border: 1px solid #90caf9;
  padding: 12px;
  font-size: 1.1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  resize: vertical;        /* Permite redimensionar manualmente na vertical */
  transition: border 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border: 1px solid #1a237e;
    box-shadow: 0 0 8px rgba(26, 35, 126, 0.6);
    outline: none;
  }

  &::placeholder {
    color: #757575;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  color: #fff;
  font-size: 1rem;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  font-weight: 500;
  width: 80%;
  margin-bottom: 10px;

  &:hover {
    background: linear-gradient(135deg, #1565c0, #0d47a1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #c5cae9;
    cursor: not-allowed;
  }
`;

export const Buttoninfo = styled.button`
  color: #0d47a1;
  font-size: 1.5rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  margin-left: 10px;
  font-weight: bold;

  &:hover {
    color: red;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #c5cae9;
    cursor: not-allowed;
  }
`;

export const Modal = styled.div<ModalProps>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  justify-content: center;
  align-items: flex-start;
`;

export const ModalContent = styled.div`
  background: linear-gradient(to bottom, #ffffff, #e3f2fd);
  margin: auto;
  padding: 30px;
  width: 85%;
  max-width: 900px;
  border-radius: 15px;
  text-align: left;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease-out;

  h3 {
    color: #1a237e;
    font-size: 1.7rem;
    font-weight: 600;
    margin-bottom: 0.5px;
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: -12px;

    .btn {
      background: linear-gradient(to right, #3f51b5, #1a237e);
      color: white;
      padding: 12px 25px;
      border: none;
      border-radius: 30px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: linear-gradient(to right, #1a237e, #3f51b5);
      }

      &:active {
        transform: scale(0.98);
      }

      &:disabled {
        background: #c5cae9;
        cursor: not-allowed;
      }
    }
  }
`;

export const ModalPre = styled.div`
  background-color: #f0f8ff;
  padding: 18px;
  border-left: 4px solid #64b5f6;
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  overflow-x: auto;
`;

export const Footer = styled.footer`
  color: #075192;
  text-align: center;
  width: 100%;
  font-size: 0.9em;
  font-weight: 500;
`;

export const XmlBox = styled.pre`
  background-color: rgb(189, 212, 231);
  padding: 20px;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 30px;
  max-height: 50vh;
  overflow-y: auto;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: #333;
  margin-left: 10px;
`;

export const CheckboxInput = styled.input`
  cursor: pointer;
  transform: scale(1.2);
  margin-right: 10px;
`;

export const ImagePreview = styled.div`
  position: fixed;
  z-index: 9999;
  border: 1px solid #ccc;
  background: #fff;
  padding: 4px;
  border-radius: 4px;
  pointer-events: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

export const ImageUploadContainer = styled.div`
  margin-bottom: 15px;
  label {
    display: inline-block;
    background-color: #0056b3;
    color: #fff;
    padding: 8px 14px;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease;
    font-size: 14px;
  }

  label:hover {
    background-color: #007bff;
  }

  input[type='file'] {
    display: none;
  }
`;
