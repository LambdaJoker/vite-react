---
alwaysApply: true
scene: git_message
---

# Git Commit Message 生成规则

请严格遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，并保持极其简洁。

## 格式要求
`<type>(<scope>): <subject>`

## Type 规范
- `feat`: 新功能 (Feature)
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式 (不影响代码运行的变动)
- `refactor`: 重构 (既不是新增功能，也不是修改 bug 的代码变动)
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

## 内容要求
1. **极简主义**：Subject 描述必须简明扼要，控制在 50 个字符以内。
2. **语言**：使用中文描述变更内容。
3. **直接输出**：只输出 commit message 本身，**不要**包含任何其他的解释、问候语或 markdown 代码块反引号。