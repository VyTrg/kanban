import { customAlphabet } from 'nanoid';

// Bảng chữ cái rút gọn tránh các ký tự dễ nhầm lẫn (như 0, O, I, l)
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 12);

/**
 * Tạo Public ID 12 ký tự (VD: aB3dEfGhIjKl)
 */
export function generatePublicId(): string {
  return nanoid();
}

/**
 * Chuyển đổi chuỗi thành slug hợp lệ (VD: "Dự án A" -> "du-an-a")
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
    .replace(/[\s_-]+/g, '-') // Thay khoảng trắng/gạch dưới bằng gạch ngang
    .replace(/^-+|-+$/g, ''); // Xóa gạch ngang thừa ở đầu/cuối
}
