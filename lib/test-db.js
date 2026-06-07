// 这个文件用于测试本地开发环境下的功能
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'dramas.json');

export function getDramasSync() {
  try {
    if (!existsSync(DATA_FILE)) {
      console.log('数据文件不存在，使用默认数据');
      return [];
    }
    const data = readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
      console.error('读取数据失败:', e);
      return [];
  }
}

export function saveDramasSync(dramas) {
  try {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(DATA_FILE, JSON.stringify(dramas, null, 2));
    console.log('数据保存成功！');
    return true;
  } catch (e) {
    console.error('保存数据失败:', e);
    return false;
  }
}

// 测试数据
const testDramas = [
  {
    id: 1,
    title: '测试剧集 1',
    synopsis: '这是一个测试',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    episodes: 10,
    year: 2026,
    genre: '测试类型',
    linkUrl: 'https://example.com',
    linkType: '夸克网盘',
    quality: 'HD',
    featured: true,
    badge: '测试',
    createdAt: new Date().toISOString()
  }
];
