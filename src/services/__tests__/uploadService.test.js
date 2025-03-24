import { uploadFile, uploadImage, uploadAudio } from '../uploadService';
import { supabase } from '../../supabaseClient';

// Mock do Supabase
const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();

jest.mock('../../supabaseClient', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  },
}));

describe('uploadService', () => {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockPublicUrl = 'https://example.com/test-image.jpg';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock do upload
    mockUpload.mockResolvedValue({ data: null, error: null });
    
    // Mock do getPublicUrl
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: mockPublicUrl },
    });
  });

  describe('uploadFile', () => {
    it('deve fazer upload do arquivo com sucesso', async () => {
      const result = await uploadFile(mockFile);

      // Verificar se o upload foi chamado com os parâmetros corretos
      expect(supabase.storage.from).toHaveBeenCalledWith('media');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('locations/'),
        mockFile
      );

      // Verificar se getPublicUrl foi chamado
      expect(mockGetPublicUrl).toHaveBeenCalled();

      // Verificar se retornou a URL pública
      expect(result).toBe(mockPublicUrl);
    });

    it('deve lançar erro se o upload falhar', async () => {
      const error = new Error('Upload failed');
      mockUpload.mockResolvedValue({ data: null, error });

      await expect(uploadFile(mockFile)).rejects.toThrow('Upload failed');
    });

    it('deve usar o bucket correto', async () => {
      await uploadFile(mockFile, 'custom-bucket');

      expect(supabase.storage.from).toHaveBeenCalledWith('custom-bucket');
    });
  });

  describe('uploadImage', () => {
    it('deve fazer upload da imagem usando o bucket media', async () => {
      const result = await uploadImage(mockFile);

      expect(supabase.storage.from).toHaveBeenCalledWith('media');
      expect(result).toBe(mockPublicUrl);
    });
  });

  describe('uploadAudio', () => {
    it('deve fazer upload do áudio usando o bucket media', async () => {
      const result = await uploadAudio(mockFile);

      expect(supabase.storage.from).toHaveBeenCalledWith('media');
      expect(result).toBe(mockPublicUrl);
    });
  });
}); 