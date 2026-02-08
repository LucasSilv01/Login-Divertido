import { useEffect, useRef, useState } from 'react'
import './App.css'

function TerminalLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [screenMode, setScreenMode] = useState('login') // 'login' | 'signup'
  const [lines, setLines] = useState([
    'RetroOS v1.2.0',
    'Bem-vindo ao terminal retrô. Digite suas credenciais.',
  ])
  const [status, setStatus] = useState('idle') // idle | trying | success | error
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers')) || []
    } catch (e) {
      console.error('Erro ao carregar usuários do localStorage:', e)
      return []
    }
  })
  const [isTypingPassword, setIsTypingPassword] = useState(false)
  const [mascoteMood, setMascoteMood] = useState('idle') // idle | typing | happy | confused | sad
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showPuzzle, setShowPuzzle] = useState(true)
  const [puzzleQuestion, setPuzzleQuestion] = useState('')
  const [puzzleAnswer, setPuzzleAnswer] = useState('')
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const inputRef = useRef(null)
  const mascoteRef = useRef(null)

  // Validadores
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length >= 5
  }

  function validatePassword(pwd) {
    const errors = []
    if (pwd.length < 8) errors.push('mín 8 caracteres')
    if (!/[a-z]/.test(pwd)) errors.push('letra minúscula')
    if (!/[A-Z]/.test(pwd)) errors.push('letra maiúscula')
    if (!/\d/.test(pwd)) errors.push('número')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('caractere especial')
    return errors
  }

  function getPasswordStrength(pwd) {
    const errors = validatePassword(pwd)
    if (pwd.length === 0) return { level: 0, label: 'nenhuma' }
    if (errors.length >= 4) return { level: 1, label: 'fraca' }
    if (errors.length >= 2) return { level: 2, label: 'média' }
    if (errors.length === 0) return { level: 3, label: 'forte' }
    return { level: 2, label: 'média' }
  }
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // foco inicial

  // Rastrear movimento do mouse para os olhos do mascote
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Gerar puzzle aleatório na inicialização e mudanças de tela
  useEffect(() => {
    if (showPuzzle && !puzzleSolved) {
      const puzzles = [
        { q: '2 + 3 = ?', a: '5', hint: 'Matemática básica' },
        { q: 'Qual cor + azul = roxo?', a: 'vermelho', hint: 'Cores primárias' },
        { q: '"RETRO" ao contrário = ?', a: 'orter', hint: 'Inverta as letras' },
        { q: 'Quanto é 8 / 2?', a: '4', hint: 'Divisão' },
        { q: 'Qual é o dobro de 7?', a: '14', hint: 'Multiplique' },
        { q: 'A capital do Brasil é?', a: 'brasilia', hint: 'Dica: DF' }
      ]
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
      setPuzzleQuestion(puzzle.q)
      setPuzzleAnswer(puzzle.a)
    }
  }, [showPuzzle, puzzleSolved])

    function _pushLine(text) {
    setLines((l) => [...l, text])
  }

  function typeLine(text, delay = 20) {
    return new Promise((resolve) => {
      setLines((l) => [...l, ''])
      for (let i = 0; i <= text.length; i++) {
        window.setTimeout(() => {
          setLines((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = text.slice(0, i)
            return copy
          })
          if (i === text.length) resolve()
        }, i * delay)
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (status === 'trying') return
    setStatus('trying')

    if (screenMode === 'login') {
      handleLogin()
    } else {
      handleSignup()
    }
  }

  async function handleLogin() {
    ;(async () => {
      setLoadingProgress(0)
      setMascoteMood('typing')
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setLoadingProgress((p) => Math.min(p + Math.random() * 30, 90))
      }, 200)

      await typeLine(`> Attempting login for ${username}...`, 14)
      await new Promise((r) => setTimeout(r, 350))

      // Validação de e-mail
      if (!username) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('sad')
        await typeLine('! Erro: e-mail vazio', 10)
        setStatus('error')
        return
      }
      if (!isValidEmail(username)) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('confused')
        await typeLine('! Erro: e-mail inválido (ex: user@example.com)', 10)
        setStatus('error')
        return
      }

      // Verificar se e-mail está cadastrado
      const user = registeredUsers.find((u) => u.email === username)
      if (!user) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('sad')
        await typeLine('! Erro: e-mail não encontrado. Cadastre-se primeiro.', 10)
        setStatus('error')
        return
      }

      // Validação de senha
      if (password.length === 0) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('confused')
        await typeLine('! Erro: senha vazia', 10)
        setStatus('error')
        return
      }

      // Verificar se senha está correta
      if (user.password !== password) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('sad')
        await typeLine('! Erro: senha incorreta', 10)
        setStatus('error')
        return
      }

      // Sucesso
      clearInterval(progressInterval)
      setLoadingProgress(100)
      setMascoteMood('happy')
      await typeLine('✔ Validação completa', 10)
      await typeLine('ACCESS GRANTED. Bem-vindo, ' + username + '!', 12)
      setStatus('success')
    })()
  }

  async function handleSignup() {
    ;(async () => {
      setLoadingProgress(0)
      setMascoteMood('typing')
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setLoadingProgress((p) => Math.min(p + Math.random() * 30, 90))
      }, 200)

      await typeLine(`> Creating account for ${username}...`, 14)
      await new Promise((r) => setTimeout(r, 350))

      // Validações de cadastro
      if (!username) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('confused')
        await typeLine('! Erro: e-mail vazio', 10)
        setStatus('error')
        return
      }
      if (!isValidEmail(username)) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('confused')
        await typeLine('! Erro: e-mail inválido', 10)
        setStatus('error')
        return
      }

      // Verificar e-mail duplicado
      if (registeredUsers.some((u) => u.email === username)) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('sad')
        await typeLine('! Erro: e-mail já cadastrado', 10)
        setStatus('error')
        return
      }

      if (!password) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('confused')
        await typeLine('! Erro: senha vazia', 10)
        setStatus('error')
        return
      }
      if (password !== confirmPassword) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('sad')
        await typeLine('! Erro: senhas não coincidem', 10)
        setStatus('error')
        return
      }
      const pwdErrors = validatePassword(password)
      if (pwdErrors.length > 0) {
        clearInterval(progressInterval)
        setLoadingProgress(0)
        setMascoteMood('confused')
        await typeLine(
          `! Erro: senha fraca. Faltam: ${pwdErrors.join(', ')}`,
          8
        )
        setStatus('error')
        return
      }

      // Sucesso - Salvar usuário
      clearInterval(progressInterval)
      setLoadingProgress(100)
      setMascoteMood('happy')
      const newUser = { email: username, password: password }
      const updatedUsers = [...registeredUsers, newUser]
      setRegisteredUsers(updatedUsers)
      try {
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
      } catch (e) {
        console.error('Erro ao salvar usuário no localStorage:', e)
      }

      // Sucesso
      await typeLine('✔ Validação completa', 10)
      await typeLine('ACCOUNT CREATED. Bem-vindo, ' + username + '!', 12)
      setStatus('success')
    })()
  }

  function clearTerminal() {
    setLines([
      'RetroOS v1.2.0',
      'Bem-vindo ao terminal retrô. Digite suas credenciais.',
    ])
    setStatus('idle')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setIsTypingPassword(false)
    setMascoteMood('idle')
    inputRef.current?.focus()
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setIsTypingPassword(e.target.value.length > 0)
    if (e.target.value.length > 0) {
      setMascoteMood('typing')
    } else {
      setMascoteMood('idle')
    }
  }

  // Calcular ângulo dos olhos para seguir o mouse
  const getEyeRotation = () => {
    if (!mascoteRef.current) return 0
    const rect = mascoteRef.current.getBoundingClientRect()
    const eyeX = rect.left + rect.width / 2
    const eyeY = rect.top + rect.height / 2
    const angle = Math.atan2(mousePos.y - eyeY, mousePos.x - eyeX) * (180 / Math.PI)
    return angle
  }

  function toggleScreen() {
    setScreenMode(screenMode === 'login' ? 'signup' : 'login')
    clearTerminal()
    setLoadingProgress(0)
    setMascoteMood('idle')
    setPuzzleSolved(false)
    setShowPuzzle(true)
  }

  return (
    <div className="terminal-wrap">
      <div className="terminal">
        <div className="term-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="title">Retro Login</div>
          </div>
        </div>

        {/* Barra de Loading XP */}
        {status === 'trying' && loadingProgress > 0 && (
          <div className="xp-loading-container">
            <div className="xp-loading-bar">
              <div className="xp-progress" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <div className="xp-loading-text">{Math.floor(loadingProgress)}%</div>
          </div>
        )}

        {/* Mini-Puzzle */}
        {showPuzzle && !puzzleSolved && status === 'idle' && (
          <div className="puzzle-container puzzle-pop">
            <div className="puzzle-box">
              <div className="puzzle-header">⚡ MINI PUZZLE ⚡</div>
              <div className="puzzle-question">{puzzleQuestion}</div>
              <div className="puzzle-input-group">
                <input
                  type="text"
                  placeholder="Sua resposta..."
                  className="puzzle-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const answer = e.currentTarget.value.toLowerCase().trim()
                      if (answer === puzzleAnswer) {
                        setPuzzleSolved(true)
                        setShowPuzzle(false)
                        setMascoteMood('happy')
                      } else {
                        e.currentTarget.value = ''
                        e.currentTarget.classList.add('shake')
                        setTimeout(() => e.currentTarget.classList.remove('shake'), 500)
                        setMascoteMood('confused')
                        setTimeout(() => setMascoteMood('idle'), 1000)
                      }
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="puzzle-hint">🎮 Acerte para desbloquear o login!</div>
            </div>
          </div>
        )}

        <div className="term-body" aria-live="polite" role="log">
          {lines.map((line, i) => (
            <div key={i} className={`line ${line.startsWith('!') ? 'err' : ''}`}>
              <span className="prompt">$</span>
              <span className="text">{line}</span>
            </div>
          ))}

          {status !== 'success' && !showPuzzle && (
            <form className="login-form screen-content" onSubmit={handleSubmit}>
              {screenMode === 'login' ? (
                <>
                  <label className="term-input">
                    <span className="email-label">E-mail:</span>
                    <input
                      ref={inputRef}
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="user@example.com"
                      aria-label="E-mail"
                      onFocus={(e) => e.currentTarget.classList.add('focused')}
                      onBlur={(e) => e.currentTarget.classList.remove('focused')}
                    />
                  </label>
                  {username && !isValidEmail(username) && (
                    <div className="feedback error-feedback">
                      ⚠ E-mail inválido
                    </div>
                  )}
                  {username && isValidEmail(username) && (
                    <div className="feedback success-feedback">✓ E-mail válido</div>
                  )}

                  <label className="term-input">
                    <span className="password-label">senha:</span>
                    <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Mín 8: ABC123!@"
                      aria-label="Senha"
                      onFocus={(e) => e.currentTarget.classList.add('focused')}
                      onBlur={(e) => e.currentTarget.classList.remove('focused')}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="term-input">
                    <span className="email-label">E-mail:</span>
                    <input
                      ref={inputRef}
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="seu@email.com"
                      aria-label="E-mail"
                      onFocus={(e) => e.currentTarget.classList.add('focused')}
                      onBlur={(e) => e.currentTarget.classList.remove('focused')}
                    />
                  </label>
                  {username && !isValidEmail(username) && (
                    <div className="feedback error-feedback">
                      ⚠ E-mail inválido
                    </div>
                  )}
                  {username && isValidEmail(username) && (
                    <div className="feedback success-feedback">✓ E-mail válido</div>
                  )}

                  <label className="term-input">
                    <span className="password-label">senha:</span>
                    <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Mín 8: ABC123!@"
                      aria-label="Senha"
                      onFocus={(e) => e.currentTarget.classList.add('focused')}
                      onBlur={(e) => e.currentTarget.classList.remove('focused')}
                    />
                  </label>
                  {password && (
                    <>
                      <div className="password-strength">
                        <div
                          className={`strength-bar strength-${getPasswordStrength(password).level}`}
                        />
                        <span className="strength-label">
                          Força: {getPasswordStrength(password).label}
                        </span>
                      </div>
                      {validatePassword(password).length > 0 && (
                        <div className="feedback error-feedback">
                          Faltam: {validatePassword(password).join(', ')}
                        </div>
                      )}
                      {validatePassword(password).length === 0 && (
                        <div className="feedback success-feedback">✓ Senha forte</div>
                      )}
                    </>
                  )}

                  <label className="term-input">
                    <span className="password-label">confirmar:</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Mín 8: ABC123!@"
                      aria-label="Confirmar senha"
                      onFocus={(e) => e.currentTarget.classList.add('focused')}
                      onBlur={(e) => e.currentTarget.classList.remove('focused')}
                    />
                  </label>
                  {confirmPassword && (
                    <>
                      {password === confirmPassword && password.length > 0 ? (
                        <div className="feedback success-feedback">
                          ✓ Senhas coincidem
                        </div>
                      ) : confirmPassword ? (
                        <div className="feedback error-feedback">
                          ⚠ Senhas não coincidem
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              )}

              <div className="buttons">
                <button type="submit" className="btn primary">
                  {status === 'trying'
                    ? 'Processando...'
                    : screenMode === 'login'
                    ? 'Entrar'
                    : 'Cadastrar'}
                </button>
                <button type="button" className="btn" onClick={clearTerminal}>
                  Limpar
                </button>
              </div>

              {/* Mascote Robô dentro do formulário */}
              <div className={`mascote-container mascote-${mascoteMood}`} ref={mascoteRef}>
                <div className="mascote">
                  <div className={`mascote-head ${isTypingPassword ? 'eyes-closed' : ''}`}>
                    <div className="mascote-eye left-eye">
                      <div 
                        className="pupil" 
                        style={{ 
                          transform: isTypingPassword ? 'none' : `rotate(${getEyeRotation()}deg) translateX(3px)` 
                        }}
                      ></div>
                    </div>
                    <div className="mascote-eye right-eye">
                      <div 
                        className="pupil" 
                        style={{ 
                          transform: isTypingPassword ? 'none' : `rotate(${getEyeRotation()}deg) translateX(3px)` 
                        }}
                      ></div>
                    </div>
                    <div className="mascote-mouth"></div>
                  </div>
                  <div className="mascote-body">
                    <div className="antenna left-antenna"></div>
                    <div className="antenna right-antenna"></div>
                  </div>
                </div>
              </div>

              <div className="toggle-screen">
                <button
                  type="button"
                  className="link-btn"
                  onClick={toggleScreen}
                >
                  {screenMode === 'login'
                    ? 'Não tem conta? Cadastre-se'
                    : 'Já tem conta? Faça login'}
                </button>
              </div>
            </form>
          )}

          {status === 'success' && (
            <div className="success-box">
              <pre>{`
███╗   ██╗███████╗██████╗ ██████╗ 
████╗  ██║██╔════╝██╔══██╗██╔══██╗
██╔██╗ ██║█████╗  ██████╔╝██║  ██║
██║╚██╗██║██╔══╝  ██╔══██╗██║  ██║
██║ ╚████║███████╗██║  ██║██████╔╝
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═════╝
              `}</pre>
              <div className="success-message">
                <p className="grant">🎉 Parabéns, ${username.toUpperCase()}! 🎉</p>
                <p>Você conseguiu! (e em apenas uma tentativa... ou não? 😏)</p>
                <p className="grant">═══════════════════════════════════</p>
                <p>✓ Sua senha foi guardada... num lugar seguro™</p>
                <p>✓ Nós definitivamente não vamos vender seus dados</p>
                <p>✓ Agora você é oficialmente parte do clube dos nerds!</p>
                <p className="grant">═══════════════════════════════════</p>
                <p style={{fontSize: '0.9rem', opacity: 0.8}}>🤖 *Mascote Ficou Feliz com o novo membro do clube 🎉🎉🎉* 🤖</p>
              </div>
              <button className="btn primary" onClick={clearTerminal}>
                Nova Sessão
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="hint">Tela offline simulada — sem conexão necessária.</p>
    </div>
  )
}

export default TerminalLogin