import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MediaSection from '../MediaSection';
import { uploadImage, uploadAudio } from '../../../../services/uploadService';

// Mock do serviço de upload
jest.mock('../../../../services/uploadService', () => ({
  uploadImage: jest.fn(),
  uploadAudio: jest.fn(),
}));

describe('MediaSection', () => {
  const mockOnUpload = jest.fn();
  const mockOnRemove = jest.fn();
  const mockOnUploadComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Upload de Imagem', () => {
    it('deve renderizar o componente de upload de imagem corretamente', () => {
      render(
        <MediaSection
          type="image"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      expect(screen.getByText(/Imagens/i)).toBeInTheDocument();
      expect(screen.getByText(/Tirar Foto ou Escolher Imagem/i)).toBeInTheDocument();
    });

    it('deve fazer upload de imagem com sucesso', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockUrl = 'https://example.com/test.jpg';
      uploadImage.mockResolvedValue(mockUrl);

      render(
        <MediaSection
          type="image"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      const input = screen.getByLabelText(/Imagens/i);
      
      await userEvent.upload(input, mockFile);

      await waitFor(() => {
        expect(uploadImage).toHaveBeenCalledWith(mockFile);
      });
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith(mockUrl);
      });
      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('deve mostrar erro quando o upload falhar', async () => {
      const mockError = new Error('Upload failed');
      uploadImage.mockRejectedValue(mockError);

      render(
        <MediaSection
          type="image"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      const input = screen.getByLabelText(/Imagens/i);
      
      await userEvent.upload(input, new File(['test'], 'test.jpg', { type: 'image/jpeg' }));

      await waitFor(() => {
        expect(screen.getByText(/Erro ao fazer upload do arquivo/i)).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(mockOnUploadComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('Upload de Áudio', () => {
    it('deve renderizar o componente de upload de áudio corretamente', () => {
      render(
        <MediaSection
          type="audio"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      expect(screen.getByText(/Áudio/i)).toBeInTheDocument();
      expect(screen.getByText(/Escolher Arquivo de Áudio/i)).toBeInTheDocument();
    });

    it('deve fazer upload de áudio com sucesso', async () => {
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mpeg' });
      const mockUrl = 'https://example.com/test.mp3';
      uploadAudio.mockResolvedValue(mockUrl);

      render(
        <MediaSection
          type="audio"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      const input = screen.getByLabelText(/Áudio/i);
      
      await userEvent.upload(input, mockFile);

      await waitFor(() => {
        expect(uploadAudio).toHaveBeenCalledWith(mockFile);
      });
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith(mockUrl);
      });
      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('deve mostrar erro quando o upload de áudio falhar', async () => {
      const mockError = new Error('Upload failed');
      uploadAudio.mockRejectedValue(mockError);

      render(
        <MediaSection
          type="audio"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      const input = screen.getByLabelText(/Áudio/i);
      
      await userEvent.upload(input, new File(['test'], 'test.mp3', { type: 'audio/mpeg' }));

      await waitFor(() => {
        expect(screen.getByText(/Erro ao fazer upload do arquivo/i)).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(mockOnUploadComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('Upload de Vídeo', () => {
    it('deve renderizar o componente de upload de vídeo corretamente', () => {
      render(
        <MediaSection
          type="video"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      expect(screen.getByText(/Vídeo/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Cole a URL do YouTube/i)).toBeInTheDocument();
    });

    it('deve atualizar o preview quando uma URL do YouTube é inserida', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=test';
      render(
        <MediaSection
          type="video"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      const input = screen.getByPlaceholderText(/Cole a URL do YouTube/i);
      
      await userEvent.type(input, mockUrl);

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith(mockUrl);
      });
    });
  });

  describe('Remoção de Mídia', () => {
    it('deve chamar onRemove quando o botão de remover é clicado', async () => {
      render(
        <MediaSection
          type="image"
          preview="https://example.com/test.jpg"
          onUpload={mockOnUpload}
          onRemove={mockOnRemove}
          onUploadComplete={mockOnUploadComplete}
        />
      );

      const removeButton = screen.getByText(/Remover Imagem/i);
      
      await userEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalled();
    });
  });
}); 