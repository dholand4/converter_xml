import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;
  max-width: 1000px;
  border-radius: 25px;
  margin: 2rem auto;
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
`;

export const Buttoninfo = styled.button`
  background: none;
  border: none;
  color: #4f72a7ff;
  font-size: 1.5rem;
  margin-left: 10px;
  margin-top: 7px;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0 5px;

  &:hover {
    color: #041a30ff;
  }
`;

export const QuestionContainer = styled.div`
  width: 100%;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  border-radius: 10px;
  border: 1px solid #90caf9;
  padding: 12px;
  font-size: 1.1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  resize: vertical;
  transition: border 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #1a237e;
    box-shadow: 0 0 8px rgba(26, 35, 126, 0.4);
    outline: none;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px;
  margin-top: 20px;
`;

export const ImageUploadContainer = styled.div`
  label {
    display: inline-block;
    background-color: #e3f2fd;
    color: #0d47a1;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid #90caf9;

    &:hover {
      background-color: #bbdefb;
    }
  }

  input[type='file'] {
    display: none;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  label {
    font-size: 1rem;
    color: #333;
    cursor: pointer;
  }

  input[type='checkbox'] {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  color: #fff;
  font-size: 1.1rem;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  width: 100%;
  max-width: 400px;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 15px rgba(21, 101, 192, 0.4);
  }
`;

export const Footer = styled.footer`
  color: #0d47a1;
  text-align: center;
  width: 100%;
  font-size: 0.9em;
  font-weight: 500;
  margin-top: -60px;
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