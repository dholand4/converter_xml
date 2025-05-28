import { useState, useRef } from 'react';
import * as S from './styles';

export default function App() {
  const [xmlContent, setXmlContent] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showXml, setShowXml] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false); // Controle do embaralhamento
  const questionsRef = useRef<HTMLTextAreaElement>(null);
  const [questionStats, setQuestionStats] = useState({ total: 0, semCorreta: 0 });



  const toggleModal = (type: 'info' | 'xml', isOpen: boolean) => {
    if (type === 'info') setShowInfo(isOpen);
    if (type === 'xml') setShowXml(isOpen);
  };

  const closeModal = (e: React.MouseEvent<HTMLDivElement>, type: 'info' | 'xml') => {
    if (e.target === e.currentTarget) toggleModal(type, false);
  };

  const escapeXML = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const generateQuestionXML = (
    questionText: string,
    options: { letter: string; text: string }[],
    correctAnswer: string,
    count: number
  ) => {
    let questionXML = `  <question type="multichoice">\n`;
    questionXML += `    <name><text>Q${count}</text></name>\n`;
    questionXML += `    <questiontext format="html">\n      <text><![CDATA[${questionText.replace(
      /\n/g,
      '<br>'
    )}]]></text>\n    </questiontext>\n`;

    // Usar o estado shuffleAnswers para decidir se vai embaralhar ou não
    questionXML += `    <shuffleanswers>${shuffleAnswers ? '1' : '0'}</shuffleanswers>\n`;

    options.forEach((option) => {
      const fraction = option.letter === correctAnswer ? '100' : '0';
      questionXML += `    <answer fraction="${fraction}"><text>${option.text}</text></answer>\n`;
    });

    questionXML += `  </question>\n`;
    return questionXML;
  };

  const generateXML = () => {
    const inputText = questionsRef.current?.value || '';
    const questionsArray = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n';
    let questionCount = 1;
    let questionText = '';
    let options: { letter: string; text: string }[] = [];
    let correctAnswer = '';
    let isReadingAlternatives = false;

    let totalQuestions = 0;
    let semCorreta = 0;

    questionsArray.forEach((line) => {
      const trimmedLine = line.trim();

      if (/^\d+[.)]/.test(trimmedLine)) {
        if (questionText) {
          xmlOutput += generateQuestionXML(questionText, options, correctAnswer, questionCount);
          if (!correctAnswer) semCorreta++;
          totalQuestions++;
          questionCount++;
        }
        questionText = trimmedLine.slice(3).trim();
        options = [];
        correctAnswer = '';
        isReadingAlternatives = false;
      } else if (trimmedLine.toUpperCase() === 'ALTERNATIVAS:') {
        isReadingAlternatives = true;
      } else if (isReadingAlternatives && /^[a-jA-J][).]/.test(trimmedLine)) {
        const optionLetter = trimmedLine[0].toLowerCase();
        let optionText = trimmedLine.slice(2).trim();
        if (/\{\s*(correto|correta)\s*\}/i.test(optionText)) {
          correctAnswer = optionLetter;
          optionText = optionText.replace(/\{\s*(correto|correta)\s*\}/i, '').trim();
        }
        options.push({ letter: optionLetter, text: escapeXML(optionText) });
      } else {
        questionText += (questionText ? '\n' : '') + trimmedLine;
      }
    });

    if (questionText) {
      xmlOutput += generateQuestionXML(questionText, options, correctAnswer, questionCount);
      if (!correctAnswer) semCorreta++;
      totalQuestions++;
    }

    xmlOutput += '</quiz>';
    setXmlContent(xmlOutput);
    setQuestionStats({ total: totalQuestions, semCorreta });
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

  return (
    <>
      <S.Container>
        <S.Title>
          Gerador de Questões para Moodle (Formato XML)
          <S.Buttoninfo onClick={() => toggleModal('info', true)}>
            ⓘ
          </S.Buttoninfo>
        </S.Title>
        <S.QuestionContainer>
          <S.Textarea ref={questionsRef} placeholder='Digite suas questões aqui...'></S.Textarea>
        </S.QuestionContainer>

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

        <S.Button onClick={generateXML}>
          Gerar XML
        </S.Button>
      </S.Container>

      {showInfo && (
        <S.Modal visible={showInfo} onClick={(e) => closeModal(e, 'info')}>
          <S.ModalContent>
            <h3>Como Utilizar o Sistema</h3>
            <p style={{ marginBottom: 0 }}>Este sistema permite gerar questões no formato XML compatível com o Moodle. Para utilizá-lo corretamente, siga as instruções abaixo:</p>
            <ul>
              <li>Digite suas questões no campo de texto, utilizando uma linha para cada pergunta.</li>
              <li>Cada questão deve começar com a numeração sequencial, como <strong>1.</strong>, <strong>2.</strong>, etc.</li>
              <li>Antes de listar as alternativas, adicione uma linha com <strong>ALTERNATIVAS:</strong> para separar o enunciado das opções.</li>
              <li>Inclua as alternativas utilizando letras de <strong>a)</strong> em diante. Você pode usar quantas alternativas desejar, desde que cada uma siga o formato <code>a)</code>, <code>b)</code>, <code>c)</code>, etc.</li>

              <li>Marque a alternativa correta com <code>{'{correta}'}</code> ou <code>{'{correto}'}</code>.</li>
            </ul>

            <S.ModalPre>
              1. Qual é a capital do Brasil?<br />
              ALTERNATIVAS:<br />
              a) São Paulo<br />
              b) Rio de Janeiro<br />
              c) Brasília <strong>{'{correta}'}</strong><br />
              d) Salvador<br />
              e) Belo Horizonte<br /><br />

              2. Qual é a capital do estado do Ceará?<br />
              ALTERNATIVAS:<br />
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
            <p>
              ✅ {questionStats.total} Questões Geradas!
              {questionStats.semCorreta > 0 && (
                <> | ⚠️ {questionStats.semCorreta} Questões sem Alternativa Correta</>
              )}
            </p>
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
