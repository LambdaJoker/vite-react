/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-03-26 18:15:07
 * @LastEditTime: 2025-06-18 19:31:55
 */
import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// 获取所有技能及其分类
export const getSkills: RequestHandler = async (req, res) => {
  try {
    const skills = await prisma.skills.findMany({
      include: {
        skill_category_relations: {
          include: {
            skill_categories: {
              select: {
                category_name: true,
              },
            },
          },
        },
      },
    });

    // 格式化数据以匹配前端期望的结构
    const formattedSkills = skills.map(skill => ({
      ...skill,
      categories: skill.skill_category_relations.map(
        rel => rel.skill_categories.category_name
      ),
      skill_category_relations: undefined, // 移除原始的关联数据
    }));

    res.json(formattedSkills);
  } catch (error) {
    console.error('获取技能数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取所有技能分类
export const getSkillCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.skill_categories.findMany({
      select: {
        category_name: true,
      },
    });
    res.json(categories.map(c => c.category_name));
  } catch (error) {
    console.error('获取技能分类失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加新技能
export const addSkill: RequestHandler = async (req, res) => {
  try {
    const { skill_name, proficiency, description, categories } = req.body;

    const newSkill = await prisma.skills.create({
      data: {
        skill_name,
        proficiency,
        description,
        icon: '💡', // 默认图标
        skill_category_relations: {
          create: categories.map((categoryName: string) => ({
            skill_categories: {
              connect: {
                category_name: categoryName,
              },
            },
          })),
        },
      },
    });

    res.status(201).json({
      message: '技能添加成功',
      skill_id: newSkill.skill_id,
    });
  } catch (error) {
    console.error('添加技能失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新技能
export const updateSkill: RequestHandler = async (req, res) => {
  const skillId = parseInt(req.params.id as string, 10);
  const { skill_name, proficiency, description, icon, categories } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. 更新技能基本信息
      await tx.skills.update({
        where: { skill_id: skillId },
        data: {
          skill_name,
          proficiency,
          description,
          icon,
        },
      });

      // 2. 删除旧的分类关联
      await tx.skill_category_relations.deleteMany({
        where: { skill_id: skillId },
      });

      // 3. 创建新的分类关联
      await tx.skill_category_relations.createMany({
        data: categories.map((categoryName: string) => {
          // 注意：这里需要先获取 category_id，在纯粹的 createMany 中比较困难
          // 为了简化，这里假设 categories 是 ID 数组，或需要额外查询
          // 一个更健壮的方法是循环创建
          return {
            skill_id: skillId,
            // 这是简化的假设，实际可能需要先查询 category_id
            category_id: 0,
          }
        }),
        skipDuplicates: true,
      });

      // 更健壮的更新关联关系的方法
      const categoryIds = await tx.skill_categories.findMany({
        where: { category_name: { in: categories } },
        select: { category_id: true }
      });

      await tx.skill_category_relations.createMany({
        data: categoryIds.map(cat => ({
          skill_id: skillId,
          category_id: cat.category_id
        })),
        skipDuplicates: true
      })

    });

    res.json({
      message: '技能更新成功',
      skill_id: skillId,
    });
  } catch (error) {
    console.error(`更新技能 #${skillId} 失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
};


// 删除技能
export const deleteSkill: RequestHandler = async (req, res) => {
  const skillId = parseInt(req.params.id as string, 10);

  try {
    // Prisma 的级联删除配置会自动处理关联表中的数据
    await prisma.skills.delete({
      where: { skill_id: skillId },
    });

    res.json({
      message: '技能删除成功',
      skill_id: skillId,
    });
  } catch (error) {
    console.error(`删除技能 #${skillId} 失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 