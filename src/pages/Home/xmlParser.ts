// src/logic/xmlParser.ts

// --- Definição das Tipagens ---

export interface Option {
    letter: string;
    text: string;
}

export interface Question {
    identifier: string; // <-- NOVA PROPRIEDADE! (Ex: "1.", "Questão 2")
    questionText: string;
    options: Option[];
    correctAnswer: string;
}

// A função escapeXML continua a mesma...
const escapeXML = (str: string): string =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

// --- LÓGICA ATUALIZADA ---
function parseQuestionBlock(blockText: string, index: number): Question | null { // Adicionamos 'index' como fallback
    const lines = blockText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        return null;
    }

    let questionText = '';
    const options: Option[] = [];
    let correctAnswer = '';
    let isReadingAlternatives = false;

    const questionHeaderRegex = /^(QUEST[ÃA]O\s*\d+|\d+[.)])/i;
    const optionRegex = /^([a-jA-J])[.)]\s+/;

    // --- NOVA LÓGICA PARA CAPTURAR O IDENTIFICADOR ---
    const headerMatch = lines[0].match(questionHeaderRegex);
    const identifier = headerMatch ? headerMatch[0] : `Questão ${index + 1}`; // Usa o número da questão se não encontrar um título

    questionText = lines[0].replace(questionHeaderRegex, '').trim();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const optionMatch = line.match(optionRegex);

        if (optionMatch) {
            isReadingAlternatives = true;
            const letter = optionMatch[1].toLowerCase();
            let text = line.replace(optionRegex, '').trim();

            if (/\{\s*(correto|correta)\s*\}/i.test(text)) {
                correctAnswer = letter;
                text = text.replace(/\{\s*(correto|correta)\s*\}/i, '').trim();
            }

            options.push({ letter, text: escapeXML(text) });
        } else if (!isReadingAlternatives) {
            questionText += `\n${line}`;
        }
    }

    if (questionText && options.length > 0) {
        // Adiciona o identificador ao objeto retornado
        return { identifier, questionText, options, correctAnswer };
    }

    return null;
}

export function parseTextToQuestions(inputText: string): Question[] {
    const questionBlocks = inputText.trim().split(/\n(?=QUEST[ÃA]O\s*\d+|\d+[.)])/i);

    return questionBlocks
        // Passamos o 'index' para o parseQuestionBlock
        .map((block, index) => parseQuestionBlock(block, index))
        .filter((question): question is Question => question !== null);
}

// A função generateMoodleXML continua exatamente a mesma...
export function generateMoodleXML(questions: Question[], shuffle: boolean): string {
    // (Nenhuma mudança necessária aqui)
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n';
    questions.forEach((question, index) => {
        const questionTextWithBreaks = question.questionText.replace(/\n/g, '<br>');
        xml += `  <question type="multichoice">\n`;
        xml += `    <name><text>${question.identifier || `Q${index + 1}`}</text></name>\n`; // Podemos usar o identifier aqui também!
        xml += `    <questiontext format="html">\n`;
        xml += `      <text><![CDATA[${questionTextWithBreaks}]]></text>\n`;
        xml += `    </questiontext>\n`;
        xml += `    <shuffleanswers>${shuffle ? '1' : '0'}</shuffleanswers>\n`;
        question.options.forEach(option => {
            const fraction = option.letter === question.correctAnswer ? '100' : '0';
            xml += `    <answer fraction="${fraction}"><text>${option.text}</text></answer>\n`;
        });
        xml += `  </question>\n`;
    });
    xml += '</quiz>';
    return xml;
}