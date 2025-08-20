import React from 'react';
import * as S from './styles';

interface XmlOutputModalProps {
    visible: boolean;
    onClose: () => void;
    stats: {
        total: number;
        issues: string[];
    };
    xmlContent: string;
    onCopy: () => void;
    onDownload: () => void;
}

const XmlOutputModal: React.FC<XmlOutputModalProps> = ({
    visible,
    onClose,
    stats,
    xmlContent,
    onCopy,
    onDownload,
}) => {
    if (!visible) {
        return null;
    }

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <S.Modal visible={visible} onClick={handleClose}>
            <S.ModalContent>
                <h3>XML Gerado:</h3>
                <p>✅ {stats.total} Questões Geradas!</p>

                {stats.issues.length > 0 && (
                    <S.WarningBox>
                        <h4>⚠️ Pontos de Atenção</h4>
                        <ul>
                            {stats.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                    </S.WarningBox>
                )}

                <div className="actions">
                    <S.Button onClick={onCopy}>Copiar Texto</S.Button>
                    <S.Button onClick={onDownload}>Baixar XML</S.Button>
                </div>
                <S.XmlBox>{xmlContent}</S.XmlBox>
            </S.ModalContent>
        </S.Modal>
    );
};

export default XmlOutputModal;