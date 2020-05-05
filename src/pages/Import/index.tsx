import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    data.set('file', await uploadedFiles[0].file);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.log((err && err.response.error) || err);
    }
  }

  function submitFile(file: File[]): void {
    let filesProps = [];
    for (const f of file) {
      const fileProps = {
        file: f,
        name: f.name,
        readableSize: filesize(f.size),
      };
      filesProps.push(fileProps);
    }
    setUploadedFiles(filesProps);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer disabled={!uploadedFiles.length}>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button
              disabled={!uploadedFiles.length}
              onClick={handleUpload}
              type="button"
            >
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
