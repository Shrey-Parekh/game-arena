# Contributing to Nexus Arena

Thank you for your interest in contributing to Nexus Arena! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🎮 Add new games
- 🎨 Improve UI/UX
- ⚡ Optimize performance
- 🧪 Write tests

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/nexus-arena.git
   cd nexus-arena
   ```
3. **Follow SETUP.md** to get the project running locally
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

**Frontend (React):**
- Use functional components with hooks
- Use meaningful component and variable names
- Keep components small and focused
- Use Tailwind CSS for styling
- Follow existing file structure

**Backend (Node.js):**
- Use ES6+ features
- Use async/await for asynchronous code
- Handle errors properly
- Add comments for complex logic
- Follow existing file structure

### Commit Messages

Use clear, descriptive commit messages:
```
feat: Add Would You Rather game
fix: Resolve socket disconnection issue
docs: Update setup instructions
style: Improve button hover effects
refactor: Simplify room manager logic
test: Add unit tests for room controller
```

### Pull Request Process

1. **Update documentation** if needed
2. **Test your changes** thoroughly
3. **Update PROJECT_STATUS.md** if adding features
4. **Create a pull request** with:
   - Clear title
   - Description of changes
   - Screenshots (if UI changes)
   - Testing steps

## 🎮 Adding New Games

To add a new game:

1. **Create game component**
   ```
   frontend/src/components/games/YourGame.jsx
   ```

2. **Add game logic handler**
   ```
   backend/src/socket/handlers/yourGameHandlers.js
   ```

3. **Update GameRoom.jsx** to render your game

4. **Update GameSelect.jsx** to show your game

5. **Add database tables** if needed

6. **Update documentation**

### Game Component Template

```jsx
import { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { useGame } from '../../contexts/GameContext'

function YourGame() {
  const { socket } = useSocket()
  const { roomCode, players, gameState } = useGame()

  useEffect(() => {
    if (!socket) return

    socket.on('your-game-event', (data) => {
      // Handle game events
    })

    return () => {
      socket.off('your-game-event')
    }
  }, [socket])

  return (
    <div>
      {/* Your game UI */}
    </div>
  )
}

export default YourGame
```

## 🐛 Reporting Bugs

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Console errors (if any)

## 💡 Suggesting Features

When suggesting features, include:
- Clear description of the feature
- Use case / problem it solves
- Proposed implementation (if you have ideas)
- Mockups or examples (if applicable)

## 🧪 Testing

Before submitting:
- Test locally with multiple browsers
- Test with multiple users (use incognito windows)
- Test disconnect/reconnect scenarios
- Check browser console for errors
- Check backend logs for errors

## 📚 Documentation

When updating documentation:
- Keep it clear and concise
- Use examples where helpful
- Update all relevant files
- Check for broken links
- Maintain consistent formatting

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email the maintainers directly
- Provide detailed information
- Allow time for a fix before disclosure

## 📋 Checklist

Before submitting a PR:
- [ ] Code follows project style
- [ ] Changes are tested locally
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console errors
- [ ] No linting errors
- [ ] PR description is complete

## 🎨 UI/UX Guidelines

When making UI changes:
- Follow the existing color palette
- Maintain responsive design
- Keep animations smooth (< 300ms)
- Ensure accessibility
- Test on mobile devices
- Use existing components when possible

## ⚡ Performance Guidelines

- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Debounce/throttle frequent events
- Optimize images and assets
- Keep bundle size small
- Test with slow connections

## 🌟 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 📞 Getting Help

- Read the documentation first
- Check existing issues
- Ask in discussions
- Be patient and respectful

## 🏆 Recognition

Contributors will be:
- Listed in the project
- Credited in release notes
- Appreciated by the community

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Nexus Arena! 🎉
