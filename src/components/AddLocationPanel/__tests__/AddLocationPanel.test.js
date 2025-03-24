import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddLocationPanel from '../index';
import { uploadImage, uploadAudio } from '../../../services/uploadService';
import { supabase } from '../../../supabaseClient';

// Mock do serviço de upload
jest.mock('../../../services/uploadService', () => ({
  uploadImage: jest.fn(),
  uploadAudio: jest.fn(),
}));

// Mock do Supabase
jest.mock('../../../supabaseClient', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null })
    })),
  },
}));

// Mock do RichTextEditor
jest.mock('../components/RichTextEditor', () => {
  return function DummyRichTextEditor({ value, onChange, error }) {
    return (
      <div>
        <textarea
          data-testid="rich-text-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  };
});

describe('AddLocationPanel', () => {
  const mockSetNewLocation = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();
  const mockNewLocation = {
    titulo: '',
    tipo: '',
    descricao_detalhada: '',
    latitude: '',
    longitude: '',
    imagens: null,
    audio: null,
    video: null,
    links: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário corretamente', () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Adicionar um Novo Local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de Marcador/i)).toBeInTheDocument();
    expect(screen.getByText(/Links/i)).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const submitButton = screen.getByText(/Salvar/i);
    
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Título é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/Localização é obrigatória/i)).toBeInTheDocument();
      expect(screen.getByText(/Descrição detalhada é obrigatória/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('deve permitir upload de imagem', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockUrl = 'https://example.com/test.jpg';
    uploadImage.mockResolvedValue(mockUrl);

    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const imageInput = screen.getByLabelText(/Imagens/i);
    
    await act(async () => {
      await userEvent.upload(imageInput, mockFile);
    });

    await waitFor(() => {
      expect(uploadImage).toHaveBeenCalledWith(mockFile);
      expect(mockSetNewLocation).toHaveBeenCalledWith(expect.objectContaining({
        imagens: mockUrl
      }));
    });
  });

  it('deve permitir upload de áudio', async () => {
    const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mpeg' });
    const mockUrl = 'https://example.com/test.mp3';
    uploadAudio.mockResolvedValue(mockUrl);

    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const audioInput = screen.getByLabelText(/Áudio/i);
    
    await act(async () => {
      await userEvent.upload(audioInput, mockFile);
    });

    await waitFor(() => {
      expect(uploadAudio).toHaveBeenCalledWith(mockFile);
      expect(mockSetNewLocation).toHaveBeenCalledWith(expect.objectContaining({
        audio: mockUrl
      }));
    });
  });

  it('deve permitir adicionar URL de vídeo do YouTube', async () => {
    const mockUrl = 'https://www.youtube.com/watch?v=test';

    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const videoInput = screen.getByPlaceholderText(/Cole a URL do YouTube/i);
    
    await act(async () => {
      await userEvent.type(videoInput, mockUrl);
    });

    await waitFor(() => {
      expect(mockSetNewLocation).toHaveBeenCalledWith(expect.objectContaining({
        video: mockUrl
      }));
    });
  });

  it('deve salvar o local quando todos os campos obrigatórios estiverem preenchidos', async () => {
    const filledLocation = {
      ...mockNewLocation,
      titulo: 'Teste',
      tipo: 'teste',
      descricao_detalhada: 'Descrição teste',
      latitude: '-23.123',
      longitude: '-46.123',
    };

    render(
      <AddLocationPanel
        newLocation={filledLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const submitButton = screen.getByText(/Salvar/i);
    
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
      expect(screen.getByText(/Local salvo com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve chamar onClose quando o botão cancelar é clicado', async () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText(/Cancelar/i);
    
    await act(async () => {
      await userEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('deve mostrar estado de loading durante o salvamento', () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={true}
      />
    );

    expect(screen.getByText(/Salvando/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeDisabled();
  });

  it('deve salvar o local com as URLs de imagens e áudio no Supabase', async () => {
    const mockImageUrl = 'https://example.com/test-image.jpg';
    const mockAudioUrl = 'https://example.com/test-audio.mp3';
    
    render(
      <AddLocationPanel
        newLocation={{
          ...mockNewLocation,
          imagens: mockImageUrl,
          audio: mockAudioUrl
        }}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Clicar no botão de salvar
    const saveButton = screen.getByText('Salvar');
    await userEvent.click(saveButton);

    // Verificar se o Supabase insert foi chamado com os dados corretos
    expect(supabase.from().insert).toHaveBeenCalledWith([
      expect.objectContaining({
        titulo: mockNewLocation.titulo,
        tipo: mockNewLocation.tipo,
        descricao_detalhada: mockNewLocation.descricao_detalhada,
        localizacao: `${mockNewLocation.latitude},${mockNewLocation.longitude}`,
        imagens: mockImageUrl,
        audio: mockAudioUrl,
      }),
    ]);
  });

  it('deve salvar o local com a URL do áudio no Supabase', async () => {
    const mockAudioUrl = 'https://example.com/audio.wav';
    
    render(
      <AddLocationPanel
        newLocation={{
          ...mockNewLocation,
          audio: mockAudioUrl
        }}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const saveButton = screen.getByText('Salvar');
    await userEvent.click(saveButton);

    expect(supabase.from).toHaveBeenCalledWith('locations3');
    expect(supabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        audio: mockAudioUrl
      })
    );
  });
});

describe('AddLocationPanel - Upload de Imagens', () => {
  const mockSetNewLocation = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();
  const mockNewLocation = {
    latitude: "-23.5505",
    longitude: "-46.6333",
    tipo: "ponto",
    titulo: "Teste Local",
    descricao_detalhada: "Descrição de teste",
    links: "",
    audio: "",
    imagens: "",
  };

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
    // Mock do uploadImage retornando uma URL
    uploadImage.mockResolvedValue('https://example.com/test-image.jpg');
    
    // Mock do Supabase insert
    supabase.from().insert().select.mockResolvedValue({
      data: [{ id: 1, ...mockNewLocation }],
      error: null,
    });
  });

  it('deve fazer upload da imagem e salvar a URL no estado', async () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Simular seleção de arquivo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/tirar foto ou escolher imagem/i);
    await userEvent.upload(input, file);

    // Verificar se a imagem foi carregada
    expect(screen.getByAltText('Preview')).toBeInTheDocument();

    // Clicar no botão de salvar
    const saveButton = screen.getByText('Salvar');
    await userEvent.click(saveButton);

    // Verificar se o uploadImage foi chamado
    expect(uploadImage).toHaveBeenCalledWith(file);

    // Verificar se o setNewLocation foi chamado com a URL da imagem
    expect(mockSetNewLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        imagens: 'https://example.com/test-image.jpg',
      })
    );
  });

  it('deve salvar o local com a URL da imagem no Supabase', async () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Simular seleção de arquivo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/tirar foto ou escolher imagem/i);
    await userEvent.upload(input, file);

    // Clicar no botão de salvar
    const saveButton = screen.getByText('Salvar');
    await userEvent.click(saveButton);

    // Verificar se o onSave foi chamado
    expect(mockOnSave).toHaveBeenCalled();

    // Verificar se o Supabase insert foi chamado com os dados corretos
    expect(supabase.from().insert).toHaveBeenCalledWith([
      expect.objectContaining({
        titulo: mockNewLocation.titulo,
        tipo: mockNewLocation.tipo,
        descricao_detalhada: mockNewLocation.descricao_detalhada,
        localizacao: `${mockNewLocation.latitude},${mockNewLocation.longitude}`,
        imagens: 'https://example.com/test-image.jpg',
      }),
    ]);
  });

  it('deve mostrar erro se o upload da imagem falhar', async () => {
    // Mock do uploadImage para simular erro
    uploadImage.mockRejectedValue(new Error('Erro no upload'));

    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Simular seleção de arquivo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/tirar foto ou escolher imagem/i);
    await userEvent.upload(input, file);

    // Clicar no botão de salvar
    const saveButton = screen.getByText('Salvar');
    await userEvent.click(saveButton);

    // Verificar se a mensagem de erro é exibida
    expect(screen.getByText('Erro ao fazer upload da imagem. Tente novamente.')).toBeInTheDocument();

    // Verificar se o onSave não foi chamado
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('deve permitir remover a imagem', async () => {
    render(
      <AddLocationPanel
        newLocation={mockNewLocation}
        setNewLocation={mockSetNewLocation}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Simular seleção de arquivo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/tirar foto ou escolher imagem/i);
    await userEvent.upload(input, file);

    // Verificar se a imagem foi carregada
    expect(screen.getByAltText('Preview')).toBeInTheDocument();

    // Clicar no botão de remover
    const removeButton = screen.getByText('Remover Imagem');
    await userEvent.click(removeButton);

    // Verificar se a imagem foi removida
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();

    // Verificar se o setNewLocation foi chamado com imagens como null
    expect(mockSetNewLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        imagens: null,
      })
    );
  });
}); 