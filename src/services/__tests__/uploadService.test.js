import { uploadFile, uploadImage, uploadAudio, uploadPDF, deleteFile } from '../uploadService';
import { supabase } from '../../supabaseClient';
import { STORAGE_BUCKETS, FILE_RESTRICTIONS } from '../../config/storage';

// Mock do Supabase
const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();

jest.mock('../../supabaseClient', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
      })),
    },
  },
}));

describe('uploadService', () => {
  const mockImageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockPdfFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
  const mockAudioFile = new File(['test'], 'test.mp3', { type: 'audio/mpeg' });
  const mockPublicUrl = 'https://example.com/test-file.pdf';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock do upload
    mockUpload.mockResolvedValue({ data: null, error: null });
    
    // Mock do getPublicUrl
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: mockPublicUrl },
    });

    // Mock do remove
    mockRemove.mockResolvedValue({ data: null, error: null });
  });

  describe('uploadFile', () => {
    it('deve fazer upload do arquivo PDF com sucesso', async () => {
      const result = await uploadFile(mockPdfFile);

      expect(supabase.storage.from).toHaveBeenCalledWith(STORAGE_BUCKETS.PDFS);
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('documents/'),
        mockPdfFile,
        expect.any(Object)
      );
      expect(mockGetPublicUrl).toHaveBeenCalled();
      expect(result).toBe(mockPublicUrl);
    });

    it('deve lançar erro para tipo de arquivo não suportado', async () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      await expect(uploadFile(invalidFile)).rejects.toThrow('Tipo de arquivo não suportado');
    });

    it('deve lançar erro para arquivo muito grande', async () => {
      const largeFile = new File(['x'.repeat(FILE_RESTRICTIONS.PDF.MAX_SIZE + 1)], 'large.pdf', { type: 'application/pdf' });
      await expect(uploadFile(largeFile)).rejects.toThrow('Arquivo muito grande');
    });

    it('deve lançar erro se o upload falhar', async () => {
      const error = new Error('Upload failed');
      mockUpload.mockResolvedValue({ data: null, error });

      await expect(uploadFile(mockPdfFile)).rejects.toThrow('Upload failed');
    });
    });

  describe('uploadPDF', () => {
    it('deve fazer upload do PDF usando o bucket pdfs', async () => {
      const result = await uploadPDF(mockPdfFile);

      expect(supabase.storage.from).toHaveBeenCalledWith(STORAGE_BUCKETS.PDFS);
      expect(result).toBe(mockPublicUrl);
    });
  });

  describe('uploadImage', () => {
    it('deve fazer upload da imagem usando o bucket media', async () => {
      const result = await uploadImage(mockImageFile);

      expect(supabase.storage.from).toHaveBeenCalledWith(STORAGE_BUCKETS.MEDIA);
      expect(result).toBe(mockPublicUrl);
    });
  });

  describe('uploadAudio', () => {
    it('deve fazer upload do áudio usando o bucket media', async () => {
      const result = await uploadAudio(mockAudioFile);

      expect(supabase.storage.from).toHaveBeenCalledWith(STORAGE_BUCKETS.MEDIA);
      expect(result).toBe(mockPublicUrl);
    });
  });

  describe('deleteFile', () => {
    it('deve deletar arquivo com sucesso', async () => {
      const filePath = 'documents/test.pdf';
      await deleteFile(filePath);

      expect(supabase.storage.from).toHaveBeenCalledWith(STORAGE_BUCKETS.PDFS);
      expect(mockRemove).toHaveBeenCalledWith([filePath]);
    });

    it('deve lançar erro se a deleção falhar', async () => {
      const error = new Error('Delete failed');
      mockRemove.mockResolvedValue({ data: null, error });

      await expect(deleteFile('test.pdf')).rejects.toThrow('Delete failed');
    });
  });
}); 