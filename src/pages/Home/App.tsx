// src/App.tsx

import { useState, useRef, useEffect } from 'react';
import { Question, parseTextToQuestions, generateMoodleXML } from './xmlParser';
import * as S from './styles';

export default function App() {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showXml, setShowXml] = useState<boolean>(false);
  const [shuffleAnswers, setShuffleAnswers] = useState<boolean>(false);
  const questionsRef = useRef<HTMLTextAreaElement>(null);

  // Estado de estatísticas atualizado para lidar com a lista de avisos
  const [questionStats, setQuestionStats] = useState<{ total: number; issues: string[] }>({ total: 0, issues: [] });

  const imageMapRef = useRef<{ [key: string]: string }>({});
  const imageCounterRef = useRef<number>(1);

  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [previewPos, setPreviewPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const adjustTextareaHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textarea = questionsRef.current;
    if (!textarea) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            const imageId = `imagem${imageCounterRef.current}`;
            imageMapRef.current[imageId] = base64;
            insertAtCursor(`[${imageId}]`);
            imageCounterRef.current += 1;

            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    };

    textarea.addEventListener('paste', handlePaste as EventListener);
    return () => {
      textarea.removeEventListener('paste', handlePaste as EventListener);
    };
  }, []);

  const toggleModal = (type: 'info' | 'xml', isOpen: boolean) => {
    if (type === 'info') setShowInfo(isOpen);
    if (type === 'xml') setShowXml(isOpen);
  };

  const closeModal = (e: React.MouseEvent<HTMLDivElement>, type: 'info' | 'xml') => {
    if (e.target === e.currentTarget) toggleModal(type, false);
  };

  const generateXML = () => {
    const inputText = questionsRef.current?.value || '';

    const parsedQuestions: Question[] = parseTextToQuestions(inputText);

    // Lógica para gerar a lista de avisos
    const issues: string[] = [];
    parsedQuestions.forEach((q) => {
      if (!q.correctAnswer) {
        issues.push(`A questão "${q.identifier}" está sem alternativa correta.`);
      }
    });

    // Resolve as imagens, modificando os objetos de questão
    parsedQuestions.forEach(q => {
      q.questionText = q.questionText.replace(/\[(imagem\d+)\]/gi, (match, imageId: string) => {
        const base64 = imageMapRef.current[imageId];
        return base64 ? `<img src="${base64}" /><br>` : match;
      });
    });

    const finalXml = generateMoodleXML(parsedQuestions, shuffleAnswers);
    setXmlContent(finalXml);

    // Atualiza o estado com a nova estrutura de estatísticas
    setQuestionStats({ total: parsedQuestions.length, issues });

    toggleModal('xml', true);
  };

  const copyText = () => {
    navigator.clipboard
      .writeText(xmlContent)
      .then(() => alert('Texto copiado para a área de transferência!'))
      .catch((err) => console.error('Erro ao copiar:', err));
  };

  const downloadXML = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'questoes_moodle.xml';
    link.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const imageId = `imagem${imageCounterRef.current}`;
      imageMapRef.current[imageId] = base64;
      insertAtCursor(`[${imageId}]`);
      imageCounterRef.current += 1;

      const textarea = questionsRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };
    reader.readAsDataURL(file);
  };

  const insertAtCursor = (text: string) => {
    const textarea = questionsRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    textarea.value = currentText.substring(0, start) + text + currentText.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const pos = textarea.selectionStart;
    const content = textarea.value;

    const regex = /\[imagem(\d+)\]/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const tag = match[0];
      const key = tag.replace(/\[|\]/g, '');
      const rangeStart = match.index;
      const rangeEnd = rangeStart + tag.length;

      if (pos >= rangeStart && pos <= rangeEnd) {
        if (imageMapRef.current[key]) {
          setHoveredImage(imageMapRef.current[key]);
          setPreviewPos({ top: e.clientY + 10, left: e.clientX + 10 });
          return;
        }
      }
    }

    setHoveredImage(null);
  };

  return (
    <>
      <S.Container>
        <S.Title>
          Gerador de Questões para Moodle (Formato XML)
          <S.Buttoninfo onClick={() => toggleModal('info', true)}>ⓘ</S.Buttoninfo>
        </S.Title>

        <S.QuestionContainer>
          <S.Textarea
            ref={questionsRef}
            placeholder="Digite suas questões aqui..."
            onMouseMove={handleMouseMove}
            onInput={adjustTextareaHeight}
          />
        </S.QuestionContainer>

        {hoveredImage && (
          <S.ImagePreview style={{ top: previewPos.top, left: previewPos.left }}>
            <img
              src={hoveredImage}
              alt="Preview"
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          </S.ImagePreview>
        )}

        <S.ImageUploadContainer>
          <label htmlFor="image-upload">Inserir Imagem</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </S.ImageUploadContainer>

        <S.CheckboxContainer>
          <label>
            <input
              type="checkbox"
              checked={shuffleAnswers}
              onChange={() => setShuffleAnswers(!shuffleAnswers)}
            />
            Embaralhar Alternativas?
          </label>
        </S.CheckboxContainer>

        <S.Button onClick={generateXML}>Gerar XML</S.Button>
      </S.Container>

      {showInfo && (
        <S.Modal visible={showInfo} onClick={(e) => closeModal(e, 'info')}>
          <S.ModalContent>
            <h3>Como Utilizar o Sistema</h3>
            <p style={{ marginBottom: 0 }}>
              Este sistema permite gerar questões no formato XML compatível com o Moodle. Para utilizá-lo corretamente, siga as instruções abaixo:
            </p>
            <ul>
              <li>Digite suas questões no campo de texto, utilizando uma linha para cada pergunta.</li>
              <li>Cada questão deve começar com a numeração sequencial, como <strong>1.</strong>, <strong>2.</strong>, etc.</li>
              <li>Inclua as alternativas utilizando letras de <strong>a)</strong> em diante. Você pode usar quantas alternativas desejar, desde que cada uma siga o formato <code>a)</code>, <code>b)</code>, <code>c)</code>, etc.</li>
              <li>Marque a alternativa correta com <code>{'{correta}'}</code> ou <code>{'{correto}'}</code>.</li>
            </ul>
            <S.ModalPre>
              1. Qual é a capital do Brasil?<br />
              a) São Paulo<br />
              b) Rio de Janeiro<br />
              c) Brasília <strong>{'{correta}'}</strong><br />
              d) Salvador<br />
              e) Belo Horizonte<br /><br />

              2. Qual é a capital do estado do Ceará?<br />
              a) Sobral<br />
              b) Juazeiro do Norte<br />
              c) Crato<br />
              d) Fortaleza <strong>{'{correto}'}</strong><br />
              e) Quixadá<br />
            </S.ModalPre>
            <p>Após inserir todas as questões, clique no botão <strong>"Gerar XML"</strong>.</p>
          </S.ModalContent>
        </S.Modal>
      )}

      {showXml && (
        <S.Modal visible={showXml} onClick={(e) => closeModal(e, 'xml')}>
          <S.ModalContent>
            <h3>XML Gerado:</h3>
            <p>✅ {questionStats.total} Questões Geradas!</p>

            {questionStats.issues.length > 0 && (
              <S.WarningBox>
                <h4>⚠️ Pontos de Atenção</h4>
                <ul>
                  {questionStats.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </S.WarningBox>
            )}

            <div className="actions">
              <S.Button onClick={copyText}>Copiar Texto</S.Button>
              <S.Button onClick={downloadXML}>Baixar XML</S.Button>
            </div>
            <S.XmlBox>{xmlContent}</S.XmlBox>
          </S.ModalContent>
        </S.Modal>
      )}

      <S.Footer>
        <p>Daniel Holanda © 2025</p>
      </S.Footer>
    </>
  );
}