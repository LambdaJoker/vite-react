/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-06-19 09:42:15
 * @LastEditTime: 2025-06-19 09:43:09
 */
import { FaGithub } from 'react-icons/fa';
import { ReactElement } from 'react';

export interface Contact {
  icon: ReactElement;
  title: string;
  content: string;
  link: string;
  linkText: string;
}

const EmojiIcon = ({ children }: { children: string }): ReactElement => <>{children}</>;

export const contacts: Contact[] = [
  {
    icon: <EmojiIcon>📧</EmojiIcon>,
    title: '邮箱',
    content: '2667534364@qq.com',
    link: 'mailto:2667534364@qq.com',
    linkText: '发送邮件',
  },
  {
    icon: <FaGithub />,
    title: 'GitHub',
    content: 'LambdaJoker',
    link: 'https://github.com/LambdaJoker',
    linkText: '访问主页',
  },
  {
    icon: <EmojiIcon>💼</EmojiIcon>,
    title: '工作机会',
    content: '期待有趣的工作机会',
    link: '/about',
    linkText: '了解更多',
  },
]; 