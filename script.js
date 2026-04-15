
/* ==============================
   NAVIGATION
============================== */
const sections = ['home','basics','phases','parsing','automata','grammar','firstfollow','simulator','quiz'];
const titles = {
  home:'Home',basics:'Compiler Basics',phases:'Phases of Compiler',
  parsing:'Parsing Techniques',automata:'Automata (DFA/NFA)',
  grammar:'Grammar & CFG',firstfollow:'FIRST & FOLLOW',
  simulator:'Compiler Simulator',quiz:'Quiz'
};

function showSection(id) {
  sections.forEach(s => {
    document.getElementById('section-'+s).classList.remove('active');
  });
  document.getElementById('section-'+id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => {
    if(el.textContent.trim().toLowerCase().includes(id === 'firstfollow' ? 'first' : id.slice(0,4))) {
      el.classList.add('active');
    }
  });
  document.getElementById('topbar-title').textContent = titles[id] || id;
  if(window.innerWidth <= 700) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').style.display = 'none';
  }
  window.scrollTo(0,0);
}

// Fix nav item matching
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
  });
});

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  const open = sb.classList.toggle('open');
  ov.style.display = open ? 'block' : 'none';
}

/* ==============================
   TABS
============================== */
function switchTab(el, containerId, tabId) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.closest('.section, .theory-block, .simulator-layout').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/* ==============================
   COLLAPSIBLE
============================== */
function toggleCollapsible(el) {
  const body = el.nextElementSibling;
  const chevron = el.querySelector('.chevron');
  body.classList.toggle('open');
  chevron && chevron.classList.toggle('open');
}

/* ==============================
   PHASES DETAIL
============================== */
const phaseData = [
  {
    name:'Lexical Analysis', icon:'🔤', color:'#3b82f6',
    def:'The first phase of a compiler that reads the source code character by character and groups them into meaningful sequences called <strong>lexemes</strong>, producing <strong>tokens</strong>.',
    input:'Source code (character stream)',
    output:'Token stream (sequence of &lt;token-type, value&gt; pairs)',
    example:'<code>int x = 5;</code> → &lt;KEYWORD, int&gt; &lt;ID, x&gt; &lt;ASSIGN, =&gt; &lt;NUM, 5&gt; &lt;SEMI, ;&gt;',
    errors:'Invalid characters (e.g. @ in C), malformed string literals, illegal tokens',
    detail:'The lexer (scanner) uses regular expressions or finite automata (DFA) to recognize tokens. It strips whitespace and comments. Token types typically include keywords, identifiers, literals, operators, and punctuation. The output feeds into the parser.'
  },
  {
    name:'Syntax Analysis (Parsing)', icon:'🌲', color:'#8b5cf6',
    def:'The second phase that checks whether the token stream conforms to the grammatical structure defined by the language\'s <strong>Context-Free Grammar</strong>, and builds a <strong>parse tree</strong>.',
    input:'Token stream from lexical analysis',
    output:'Parse Tree / Abstract Syntax Tree (AST)',
    example:'Tokens for <code>x = a + b</code> → Verify structure matches assignment grammar → Build AST',
    errors:'Missing semicolons, unmatched parentheses, wrong order of tokens, unknown constructs',
    detail:'The parser uses grammar rules to validate token sequences. It can be top-down (LL) or bottom-up (LR). The resulting AST drops syntactic sugar and retains semantic structure needed by later phases.'
  },
  {
    name:'Semantic Analysis', icon:'🔍', color:'#10b981',
    def:'The third phase that checks the AST for <strong>semantic correctness</strong> — ensuring the program makes logical sense beyond syntactic validity.',
    input:'Abstract Syntax Tree (AST)',
    output:'Annotated AST + Symbol Table',
    example:'<code>int x = "hello";</code> → Error: cannot assign string to int variable',
    errors:'Type mismatches, undeclared variables, wrong number of arguments, out-of-scope identifiers',
    detail:'The semantic analyzer traverses the AST, builds and queries the symbol table, enforces type rules, and annotates nodes with type information. It also checks for undefined labels, duplicate declarations, and control flow issues.'
  },
  {
    name:'Intermediate Code Generation', icon:'💻', color:'#f59e0b',
    def:'Translates the annotated AST into an <strong>intermediate representation (IR)</strong> — a machine-independent code form that is easier to optimize.',
    input:'Annotated AST + Symbol Table',
    output:'Three-address code (TAC) or quadruples',
    example:'<code>a = b + c * d</code> → t1 = c * d; t2 = b + t1; a = t2',
    errors:'None typically (errors caught by previous phases)',
    detail:'Common IR forms include Three-Address Code, SSA (Static Single Assignment), and bytecode. TAC uses at most one operator per instruction, making optimization straightforward. Temporaries (t1, t2, …) hold intermediate values.'
  },
  {
    name:'Code Optimization', icon:'⚡', color:'#f97316',
    def:'Improves the intermediate code to produce <strong>faster and/or smaller</strong> code without changing the program\'s meaning.',
    input:'Intermediate code (TAC)',
    output:'Optimized intermediate code',
    example:'Constant Folding: <code>t1 = 3 + 5</code> → <code>t1 = 8</code>; Dead Code: removing unreachable code',
    errors:'None (optimization is semantics-preserving)',
    detail:'Optimization techniques include: constant folding, constant propagation, dead code elimination, common subexpression elimination, loop invariant code motion, inlining, and register allocation hints. Can operate on local, global, or interprocedural scope.'
  },
  {
    name:'Code Generation', icon:'🖥️', color:'#ec4899',
    def:'The final phase that translates the optimized IR into <strong>target machine code</strong> (assembly or object code) for a specific hardware architecture.',
    input:'Optimized intermediate code',
    output:'Assembly code / machine code / object file',
    example:'<code>a = b + c</code> → MOV R1, b; ADD R1, c; MOV a, R1',
    errors:'None for correctness; code generator aims for efficiency',
    detail:'The code generator performs instruction selection (mapping IR to target instructions), register allocation (assigning variables to CPU registers), and instruction scheduling (reordering for pipeline efficiency). The output is a valid assembly or binary program.'
  }
];

let activePhaseIdx = -1;

function showPhase(idx) {
  document.querySelectorAll('.phase-node').forEach((n,i) => {
    n.classList.toggle('active', i === idx);
  });
  const container = document.getElementById('phase-detail-container');
  if(activePhaseIdx === idx) {
    container.innerHTML = '';
    activePhaseIdx = -1;
    return;
  }
  activePhaseIdx = idx;
  const p = phaseData[idx];
  const hex2rgba=(h,a)=>{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return `rgba(${r},${g},${b},${a})`;};
  container.innerHTML = `
    <div class="phase-detail show"
         style="--pd-color:${p.color};--pd-glow:${hex2rgba(p.color,.12)};
                border-color:${hex2rgba(p.color,.25)};
                background:linear-gradient(135deg,${hex2rgba(p.color,.07)},var(--bg2));">
      <!-- header -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px">
        <div style="width:62px;height:62px;border-radius:16px;
                    background:${hex2rgba(p.color,.14)};border:2px solid ${hex2rgba(p.color,.35)};
                    display:flex;align-items:center;justify-content:center;
                    font-size:30px;flex-shrink:0;
                    box-shadow:0 4px 24px ${hex2rgba(p.color,.3)}">
          ${p.icon}
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;
                      color:${p.color};font-weight:700;margin-bottom:4px;opacity:.8">
            Phase ${idx+1} of 6
          </div>
          <h3 style="color:${p.color};font-size:21px;margin:0;letter-spacing:-.01em">${p.name}</h3>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:36px;font-weight:900;color:${hex2rgba(p.color,.12)};
                      line-height:1;user-select:none">${idx+1}</div>
        </div>
      </div>
      <!-- definition -->
      <p style="font-size:14px;color:var(--text2);margin:0 0 18px;line-height:1.75">${p.def}</p>
      <!-- IO boxes -->
      <div class="io-row">
        <div class="io-box" style="border-color:${hex2rgba(p.color,.2)};background:${hex2rgba(p.color,.06)}">
          <div class="io-label" style="color:${p.color}">📥 Input</div>
          <div class="io-val">${p.input}</div>
        </div>
        <div class="io-box" style="border-color:${hex2rgba(p.color,.2)};background:${hex2rgba(p.color,.06)}">
          <div class="io-label" style="color:${p.color}">📤 Output</div>
          <div class="io-val">${p.output}</div>
        </div>
      </div>
      <!-- example -->
      <div class="io-box" style="margin-bottom:12px;border-color:${hex2rgba(p.color,.2)};background:${hex2rgba(p.color,.06)}">
        <div class="io-label" style="color:${p.color}">💡 Example</div>
        <div class="io-val" style="font-family:'Syne',sans-serif;font-size:13px;line-height:1.6">${p.example}</div>
      </div>
      <!-- errors -->
      <div class="io-box" style="border-color:rgba(239,68,68,.22);background:rgba(239,68,68,.05);margin-bottom:14px">
        <div class="io-label" style="color:var(--red)">⚠️ Errors Handled</div>
        <div class="io-val" style="font-family:'Syne',sans-serif;font-size:13px;color:var(--text2)">${p.errors}</div>
      </div>
      <!-- detail -->
      <p style="font-size:13px;color:var(--text2);line-height:1.8;
                border-top:1px solid ${hex2rgba(p.color,.15)};padding-top:14px">${p.detail}</p>
    </div>`;
}

/* ==============================
   COMPILER ENGINE
============================== */
let compilerResults = null;
let currentPhaseKey = 'lex';

const EXAMPLES = {
  simple:`int a = 5;`,
  arith:`int x = 3 + 4 * 2;`,
  multi:`int a = 5;\nint b = 10;\nint c = a + b;`,
  error_lex:`int a = 5;\nint b = @3;`,
  error_syn:`int a = 5\nint b = 10;`,
  error_sem:`int a = 5;\nb = a + 1;`
};

function loadExample() {
  const sel = document.getElementById('example-select').value;
  if(sel && EXAMPLES[sel]) {
    document.getElementById('code-editor').value = EXAMPLES[sel];
    updateLineCount();
  }
}

document.getElementById('code-editor').addEventListener('input', updateLineCount);
function updateLineCount() {
  const lines = document.getElementById('code-editor').value.split('\n').length;
  document.getElementById('line-count').textContent = lines + ' line' + (lines !== 1 ? 's' : '');
}

/* --- LEXER --- */
function tokenize(code) {
  const tokens = [];
  const errors = [];
  const lines = code.split('\n');
  
  const patterns = [
    { type:'KEYWORD', regex:/^(int|float|char|double|return|if|else|while|for|void)\b/ },
    { type:'IDENTIFIER', regex:/^[a-zA-Z_][a-zA-Z0-9_]*/ },
    { type:'NUMBER', regex:/^\d+(\.\d+)?/ },
    { type:'STRING', regex:/^"[^"]*"/ },
    { type:'ASSIGN', regex:/^=(?!=)/ },
    { type:'EQ', regex:/^==/ },
    { type:'NEQ', regex:/^!=/ },
    { type:'LTE', regex:/^<=/ },
    { type:'GTE', regex:/^>=/ },
    { type:'LT', regex:/^</ },
    { type:'GT', regex:/^>/ },
    { type:'PLUS', regex:/^\+/ },
    { type:'MINUS', regex:/^-/ },
    { type:'STAR', regex:/^\*/ },
    { type:'SLASH', regex:/^\// },
    { type:'PERCENT', regex:/^%/ },
    { type:'SEMICOLON', regex:/^;/ },
    { type:'LPAREN', regex:/^\(/ },
    { type:'RPAREN', regex:/^\)/ },
    { type:'LBRACE', regex:/^{/ },
    { type:'RBRACE', regex:/^}/ },
    { type:'COMMA', regex:/^,/ },
  ];

  lines.forEach((line, lineNum) => {
    let pos = 0;
    while(pos < line.length) {
      // Skip whitespace
      if(/\s/.test(line[pos])) { pos++; continue; }
      // Skip comments
      if(line.slice(pos).startsWith('//')) break;
      
      let matched = false;
      for(const pat of patterns) {
        const m = line.slice(pos).match(pat.regex);
        if(m) {
          tokens.push({ type:pat.type, value:m[0], line:lineNum+1, col:pos+1 });
          pos += m[0].length;
          matched = true;
          break;
        }
      }
      if(!matched) {
        errors.push({ type:'Lexical Error', msg:`Invalid character '${line[pos]}'`, line:lineNum+1, col:pos+1 });
        pos++;
      }
    }
  });
  return { tokens, errors };
}

/* --- PARSER (simple statement grammar) --- */
function parse(tokens, lexErrors) {
  if(lexErrors.length > 0) return { ast:null, errors:lexErrors };
  
  const errors = [];
  const statements = [];
  let i = 0;
  
  function peek() { return tokens[i]; }
  function consume() { return tokens[i++]; }
  function expect(type) {
    if(tokens[i] && tokens[i].type === type) return consume();
    const tok = tokens[i];
    const line = tok ? tok.line : '?';
    errors.push({ type:'Syntax Error', msg:`Expected ${type}, got ${tok ? tok.type+'('+tok.value+')' : 'EOF'}`, line, col:tok?tok.col:'?' });
    return null;
  }

  while(i < tokens.length) {
    const t = peek();
    if(!t) break;
    
    // Declaration: type id = expr ;
    if(t.type === 'KEYWORD' && ['int','float','char','double'].includes(t.value)) {
      const typeT = consume();
      const idT = expect('IDENTIFIER');
      if(!idT) { while(tokens[i] && tokens[i].type !== 'SEMICOLON') i++; i++; continue; }
      
      if(peek() && peek().type === 'ASSIGN') {
        consume(); // =
        const expr = parseExpr();
        expect('SEMICOLON');
        statements.push({ kind:'decl', varType:typeT.value, name:idT.value, expr, line:typeT.line });
      } else if(peek() && peek().type === 'SEMICOLON') {
        consume();
        statements.push({ kind:'decl', varType:typeT.value, name:idT.value, expr:null, line:typeT.line });
      } else {
        errors.push({ type:'Syntax Error', msg:`Missing '=' or ';' after declaration`, line:typeT.line });
        while(tokens[i] && tokens[i].type !== 'SEMICOLON') i++; i++;
      }
    }
    // Assignment: id = expr ;
    else if(t.type === 'IDENTIFIER') {
      const idT = consume();
      if(peek() && peek().type === 'ASSIGN') {
        consume();
        const expr = parseExpr();
        if(!expect('SEMICOLON') && errors.length === 0) {
          errors.push({ type:'Syntax Error', msg:`Missing ';' after statement`, line:idT.line });
        }
        statements.push({ kind:'assign', name:idT.value, expr, line:idT.line });
      } else {
        errors.push({ type:'Syntax Error', msg:`Expected '=' after identifier '${idT.value}'`, line:idT.line });
        while(tokens[i] && tokens[i].type !== 'SEMICOLON') i++; i++;
      }
    }
    else { i++; }
  }
  
  function parseExpr() {
    return parseAddSub();
  }
  function parseAddSub() {
    let left = parseMulDiv();
    while(peek() && (peek().type === 'PLUS' || peek().type === 'MINUS')) {
      const op = consume();
      const right = parseMulDiv();
      left = { kind:'binop', op:op.value, left, right };
    }
    return left;
  }
  function parseMulDiv() {
    let left = parsePrimary();
    while(peek() && (peek().type === 'STAR' || peek().type === 'SLASH')) {
      const op = consume();
      const right = parsePrimary();
      left = { kind:'binop', op:op.value, left, right };
    }
    return left;
  }
  function parsePrimary() {
    const t = peek();
    if(!t) return null;
    if(t.type === 'NUMBER') { consume(); return { kind:'num', value:t.value }; }
    if(t.type === 'IDENTIFIER') { consume(); return { kind:'id', value:t.value }; }
    if(t.type === 'LPAREN') {
      consume();
      const e = parseExpr();
      expect('RPAREN');
      return e;
    }
    errors.push({ type:'Syntax Error', msg:`Unexpected token '${t.value}'`, line:t.line });
    consume();
    return null;
  }

  return { ast:{ kind:'program', statements }, errors };
}

/* --- SEMANTIC ANALYSIS --- */
function semanticAnalyze(ast, parseErrors) {
  if(parseErrors.length > 0) return { symbolTable:{}, errors:parseErrors, annotated:null };
  
  const symTable = {};
  const errors = [];
  
  function checkExpr(expr) {
    if(!expr) return 'unknown';
    if(expr.kind === 'num') return expr.value.includes('.') ? 'float' : 'int';
    if(expr.kind === 'id') {
      if(!symTable[expr.value]) {
        errors.push({ type:'Semantic Error', msg:`Use of undeclared variable '${expr.value}'`, line:'?' });
        return 'unknown';
      }
      return symTable[expr.value].type;
    }
    if(expr.kind === 'binop') {
      const lt = checkExpr(expr.left);
      const rt = checkExpr(expr.right);
      if(lt !== rt && lt !== 'unknown' && rt !== 'unknown') {
        errors.push({ type:'Semantic Error', msg:`Type mismatch: cannot apply '${expr.op}' to ${lt} and ${rt}`, line:'?' });
      }
      return lt;
    }
    return 'unknown';
  }
  
  if(ast && ast.statements) {
    ast.statements.forEach(stmt => {
      if(stmt.kind === 'decl') {
        if(symTable[stmt.name]) {
          errors.push({ type:'Semantic Error', msg:`Redeclaration of variable '${stmt.name}'`, line:stmt.line });
        }
        const exprType = stmt.expr ? checkExpr(stmt.expr) : stmt.varType;
        if(exprType !== stmt.varType && exprType !== 'unknown') {
          errors.push({ type:'Semantic Error', msg:`Cannot assign ${exprType} to variable of type ${stmt.varType}`, line:stmt.line });
        }
        symTable[stmt.name] = { type:stmt.varType, value:null, line:stmt.line };
      } else if(stmt.kind === 'assign') {
        if(!symTable[stmt.name]) {
          errors.push({ type:'Semantic Error', msg:`Assignment to undeclared variable '${stmt.name}'`, line:stmt.line });
        }
        if(stmt.expr) checkExpr(stmt.expr);
      }
    });
  }
  
  return { symbolTable:symTable, errors, annotated:ast };
}

/* --- INTERMEDIATE CODE GENERATOR --- */
let tempCount = 0;
function genIR(ast, semErrors) {
  if(semErrors.length > 0) return { code:[], errors:semErrors };
  tempCount = 0;
  const code = [];
  
  function newTemp() { return 't' + (++tempCount); }
  
  function genExpr(expr) {
    if(!expr) return '?';
    if(expr.kind === 'num') return expr.value;
    if(expr.kind === 'id') return expr.value;
    if(expr.kind === 'binop') {
      const l = genExpr(expr.left);
      const r = genExpr(expr.right);
      const t = newTemp();
      code.push(`${t} = ${l} ${expr.op} ${r}`);
      return t;
    }
    return '?';
  }
  
  if(ast && ast.statements) {
    ast.statements.forEach(stmt => {
      if(stmt.kind === 'decl' && stmt.expr) {
        const res = genExpr(stmt.expr);
        if(res !== stmt.name) code.push(`${stmt.name} = ${res}`);
      } else if(stmt.kind === 'assign') {
        const res = genExpr(stmt.expr);
        if(res !== stmt.name) code.push(`${stmt.name} = ${res}`);
      }
    });
  }
  return { code, errors:[] };
}

/* --- OPTIMIZER --- */
function optimize(irCode) {
  const before = [...irCode];
  const after = irCode.map(line => {
    // Constant folding
    return line.replace(/(\d+\.?\d*)\s*([+\-*\/])\s*(\d+\.?\d*)/g, (_, a, op, b) => {
      const av = parseFloat(a), bv = parseFloat(b);
      let r;
      if(op==='+') r=av+bv;
      else if(op==='-') r=av-bv;
      else if(op==='*') r=av*bv;
      else if(op==='/') r=bv!==0?av/bv:'div0';
      return Number.isInteger(r) ? String(r) : String(r);
    });
  });
  // Dead code: remove t = t
  const filtered = after.filter(l => {
    const m = l.match(/^(\w+)\s*=\s*(\w+)$/);
    return !(m && m[1] === m[2]);
  });
  return { before, after:filtered, changes: before.filter((l,i) => l !== filtered[i]).length };
}

/* --- CODE GENERATOR --- */
function generateCode(irCode) {
  const asm = [];
  asm.push('; === Generated Assembly (pseudo x86) ===');
  asm.push('section .text');
  asm.push('global _start');
  asm.push('_start:');
  irCode.forEach(line => {
    const m3 = line.match(/^(\w+)\s*=\s*(\w+)\s*([+\-*\/])\s*(\w+)$/);
    const m2 = line.match(/^(\w+)\s*=\s*(\w+)$/);
    const m1 = line.match(/^(\w+)\s*=\s*(\d+)$/);
    if(m3) {
      asm.push(`  ; ${line}`);
      asm.push(`  MOV eax, ${m3[2]}`);
      const ops = {'+':'ADD','-':'SUB','*':'IMUL','/':'IDIV'};
      asm.push(`  ${ops[m3[3]]||'ADD'} eax, ${m3[4]}`);
      asm.push(`  MOV ${m3[1]}, eax`);
    } else if(m1) {
      asm.push(`  MOV DWORD [${m1[1]}], ${m1[2]}`);
    } else if(m2) {
      asm.push(`  MOV eax, ${m2[2]}`);
      asm.push(`  MOV ${m2[1]}, eax`);
    }
  });
  asm.push('  MOV eax, 1   ; sys_exit');
  asm.push('  XOR ebx, ebx');
  asm.push('  INT 0x80');
  return asm;
}

/* --- RUN COMPILER --- */
function runCompiler() {
  const code = document.getElementById('code-editor').value.trim();
  if(!code) return;
  
  const btn = document.getElementById('run-btn');
  btn.classList.add('loading');
  btn.textContent = '⏳ Compiling…';
  
  setTimeout(() => {
    const lexResult = tokenize(code);
    const parseResult = parse(lexResult.tokens, lexResult.errors);
    const semResult = semanticAnalyze(parseResult.ast, parseResult.errors);
    const irResult = genIR(semResult.annotated, semResult.errors);
    const optResult = optimize(irResult.code);
    const asmResult = generateCode(optResult.after);
    
    compilerResults = {
      lex: { tokens:lexResult.tokens, errors:lexResult.errors },
      syn: { ast:parseResult.ast, errors:parseResult.errors },
      sem: { symbolTable:semResult.symbolTable, errors:semResult.errors },
      int: { code:irResult.code, errors:irResult.errors },
      opt: { before:optResult.before, after:optResult.after, changes:optResult.changes },
      gen: { asm:asmResult, errors:[] }
    };
    
    updatePhaseTabStatus();
    showPhaseOutput('lex');
    setProgress(100/6);
    
    btn.classList.remove('loading');
    btn.textContent = '▶ Run Compiler';
    
    document.getElementById('prev-step').disabled = true;
    document.getElementById('next-step').disabled = false;
    document.getElementById('step-info').textContent = 'Phase 1/6 — Lexical Analysis';
    currentPhaseKey = 'lex';
  }, 300);
}

function updatePhaseTabStatus() {
  const phaseKeys = ['lex','syn','sem','int','opt','gen'];
  phaseKeys.forEach(k => {
    const tab = document.querySelector(`.phase-tab[data-phase="${k}"]`);
    tab.classList.remove('done','error','active');
    if(compilerResults[k].errors && compilerResults[k].errors.length > 0) {
      tab.classList.add('error');
    } else {
      tab.classList.add('done');
    }
  });
  document.querySelector(`.phase-tab[data-phase="lex"]`).classList.add('active');
}

const phaseOrder = ['lex','syn','sem','int','opt','gen'];
function showPhaseOutput(key) {
  currentPhaseKey = key;
  document.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
  const tab = document.querySelector(`.phase-tab[data-phase="${key}"]`);
  if(tab) tab.classList.add('active');
  
  const idx = phaseOrder.indexOf(key) + 1;
  setProgress(100 * idx / 6);
  
  const phaseNames = {lex:'Lexical Analysis',syn:'Syntax Analysis',sem:'Semantic Analysis',int:'Intermediate Code',opt:'Code Optimization',gen:'Code Generation'};
  document.getElementById('step-info').textContent = `Phase ${idx}/6 — ${phaseNames[key]}`;
  document.getElementById('prev-step').disabled = idx === 1;
  document.getElementById('next-step').disabled = idx === 6;
  
  if(!compilerResults) return;
  
  const output = document.getElementById('phase-output');
  const r = compilerResults[key];
  
  if(r.errors && r.errors.length > 0) {
    output.innerHTML = renderErrors(r.errors);
    return;
  }
  
  if(key === 'lex') output.innerHTML = renderTokens(r.tokens);
  else if(key === 'syn') output.innerHTML = renderAST(r.ast);
  else if(key === 'sem') output.innerHTML = renderSymbolTable(r.symbolTable);
  else if(key === 'int') output.innerHTML = renderTAC(r.code);
  else if(key === 'opt') output.innerHTML = renderOpt(r);
  else if(key === 'gen') output.innerHTML = renderASM(r.asm);
}

function changeStep(dir) {
  const idx = phaseOrder.indexOf(currentPhaseKey);
  const next = idx + dir;
  if(next >= 0 && next < phaseOrder.length) {
    showPhaseOutput(phaseOrder[next]);
  }
}

function setProgress(pct) {
  document.getElementById('progress-fill').style.width = Math.min(100,pct) + '%';
}

/* --- RENDERERS --- */
const typeColors = {
  KEYWORD:'t-kw',IDENTIFIER:'t-id',NUMBER:'t-num',
  PLUS:'t-op',MINUS:'t-op',STAR:'t-op',SLASH:'t-op',ASSIGN:'t-op',
  SEMICOLON:'t-punc',LPAREN:'t-punc',RPAREN:'t-punc',
  LBRACE:'t-punc',RBRACE:'t-punc',COMMA:'t-punc',
  STRING:'t-str',EQ:'t-op',NEQ:'t-op',LT:'t-op',GT:'t-op',LTE:'t-op',GTE:'t-op'
};

function renderTokens(tokens) {
  if(!tokens.length) return '<div class="empty-state"><p>No tokens generated.</p></div>';
  let html = `<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
    <span style="font-size:12px;color:var(--text3)">Total tokens: <strong style="color:var(--text)">${tokens.length}</strong></span>
    <button class="download-btn" onclick="downloadTokens()">⬇ Export CSV</button>
  </div>
  <div class="token-grid">
    <div class="th">Token Value</div><div class="th">Token Type</div><div class="th">Line:Col</div>`;
  tokens.forEach((t,i) => {
    const cls = typeColors[t.type] || '';
    const delay = Math.min(i*0.04, 1);
    html += `<div class="token-cell ${cls}" style="animation-delay:${delay}s">${escHtml(t.value)}</div>
    <div class="token-cell" style="animation-delay:${delay}s"><span class="td-badge ${badgeClass(t.type)}">${t.type}</span></div>
    <div class="token-cell t-punc" style="animation-delay:${delay}s">${t.line}:${t.col}</div>`;
  });
  html += '</div>';
  return html;
}

function badgeClass(type) {
  if(type === 'KEYWORD') return 'tag-purple';
  if(type === 'IDENTIFIER') return 'tag-green';
  if(type === 'NUMBER') return 'tag-orange';
  if(['PLUS','MINUS','STAR','SLASH','ASSIGN','EQ','NEQ','LT','GT','LTE','GTE'].includes(type)) return 'tag-blue';
  return 'tag-cyan';
}

function renderAST(ast) {
  if(!ast) return renderErrors([{type:'Syntax Error',msg:'Parse failed',line:'?'}]);
  
  let dot = `<div style="margin-bottom:8px;font-size:12px;color:var(--text3)">Parse Tree (simplified AST visualization)</div>`;
  dot += `<svg id="ast-svg" viewBox="0 0 560 ${50 + ast.statements.length * 80}" style="width:100%;background:var(--bg3);border-radius:8px;min-height:180px">`;
  
  // Root
  dot += node(280, 30, 'PROGRAM', '#818cf8');
  
  ast.statements.forEach((stmt, si) => {
    const sx = 80 + si * 160;
    const sy = 110;
    dot += line(280, 50, sx, sy - 20);
    if(stmt.kind === 'decl') {
      dot += node(sx, sy, `DECL\n${stmt.varType} ${stmt.name}`, '#3b82f6');
      if(stmt.expr) {
        dot += line(sx, sy+22, sx, sy+70);
        dot += renderExprNode(stmt.expr, sx, sy+90);
      }
    } else if(stmt.kind === 'assign') {
      dot += node(sx, sy, `ASSIGN\n${stmt.name}`, '#10b981');
      if(stmt.expr) {
        dot += line(sx, sy+22, sx, sy+70);
        dot += renderExprNode(stmt.expr, sx, sy+90);
      }
    }
  });
  
  dot += '</svg>';
  return dot;
}

function renderExprNode(expr, x, y) {
  if(!expr) return '';
  if(expr.kind === 'num') return node(x, y, expr.value, '#fb923c');
  if(expr.kind === 'id') return node(x, y, expr.value, '#34d399');
  if(expr.kind === 'binop') {
    let html = node(x, y, expr.op, '#f472b6');
    html += line(x, y+22, x-40, y+60);
    html += line(x, y+22, x+40, y+60);
    html += renderExprNode(expr.left, x-40, y+70);
    html += renderExprNode(expr.right, x+40, y+70);
    return html;
  }
  return '';
}

function node(x, y, label, color) {
  const lines = label.split('\n');
  const w = Math.max(60, lines[0].length * 7 + 16);
  let html = `<rect x="${x-w/2}" y="${y-16}" width="${w}" height="32" rx="6" fill="${color}18" stroke="${color}" stroke-width="1.5"/>`;
  lines.forEach((l,i) => {
    html += `<text x="${x}" y="${y + (lines.length>1?-4+i*14:5)}" text-anchor="middle" fill="${color}" font-family="JetBrains Mono" font-size="${lines.length>1?9:11}" font-weight="600">${escHtml(l)}</text>`;
  });
  return html;
}
function line(x1,y1,x2,y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3b82f620" stroke-width="1.5"/>`;
}

function renderSymbolTable(symTable) {
  const entries = Object.entries(symTable);
  if(!entries.length) return '<div class="empty-state"><p>Symbol table is empty.</p></div>';
  
  let html = `<div style="margin-bottom:12px;font-size:12px;color:var(--text3)">${entries.length} symbol(s) found</div>`;
  html += '<div class="symbol-row"><div class="sr-cell th" style="font-family:Syne,sans-serif;font-size:10px;text-transform:uppercase;color:var(--text3)">Name</div><div class="sr-cell th" style="font-family:Syne,sans-serif;font-size:10px;text-transform:uppercase;color:var(--text3)">Type</div><div class="sr-cell th" style="font-family:Syne,sans-serif;font-size:10px;text-transform:uppercase;color:var(--text3)">Scope</div><div class="sr-cell th" style="font-family:Syne,sans-serif;font-size:10px;text-transform:uppercase;color:var(--text3)">Line</div></div>';
  entries.forEach(([name, info], i) => {
    const delay = i * 0.06;
    html += `<div class="symbol-row">
      <div class="sr-cell t-id" style="animation-delay:${delay}s">${name}</div>
      <div class="sr-cell t-kw" style="animation-delay:${delay}s">${info.type}</div>
      <div class="sr-cell t-punc" style="animation-delay:${delay}s">global</div>
      <div class="sr-cell t-num" style="animation-delay:${delay}s">${info.line}</div>
    </div>`;
  });
  return html;
}

function renderTAC(code) {
  if(!code.length) return '<div class="success-item">✅ No intermediate code generated (empty program).</div>';
  let html = '<div style="margin-bottom:10px;font-size:12px;color:var(--text3)">Three-Address Code (TAC)</div>';
  code.forEach((line, i) => {
    const delay = i * 0.07;
    html += `<div class="tac-line" style="animation-delay:${delay}s">
      <span class="tac-num">${i+1}</span>
      <span class="tac-code">${formatTAC(line)}</span>
    </div>`;
  });
  return html;
}

function formatTAC(line) {
  return line.replace(/(\w+)(\s*=\s*)/g, '<span class="t-id">$1</span>$2')
             .replace(/([+\-*\/])/g, '<span class="t-op">$1</span>');
}

function renderOpt(r) {
  if(!r.before.length) return '<div class="success-item">✅ No code to optimize.</div>';
  const changed = r.before.length !== r.after.length || r.before.some((l,i) => l !== r.after[i]);
  let html = `<div style="margin-bottom:12px;font-size:12px;color:var(--text3)">
    Optimizations applied: <strong style="color:${changed?'var(--green)':'var(--text2)'}">${changed ? (r.before.length - r.after.length + r.changes) + ' transformation(s)' : 'None needed'}</strong>
  </div>`;
  
  const maxLen = Math.max(r.before.length, r.after.length);
  for(let i=0; i<maxLen; i++) {
    const b = r.before[i] || '—';
    const a = r.after[i] || '—';
    const changed = b !== a;
    html += `<div class="opt-row">
      <div class="opt-before" style="${!changed?'opacity:0.5':''}"> ${b}</div>
      <div class="opt-arrow">${changed?'→':'='}</div>
      <div class="opt-after" style="${!changed?'opacity:0.5':''}">${a}</div>
    </div>`;
  }
  return html;
}

function renderASM(asm) {
  let html = '<div style="margin-bottom:10px;font-size:12px;color:var(--text3)">Target Assembly (pseudo x86)</div>';
  asm.forEach((line, i) => {
    const delay = i * 0.04;
    if(line.startsWith(';')) {
      html += `<div class="asm-line asm-comment" style="animation-delay:${delay}s">${line}</div>`;
    } else if(line.endsWith(':')) {
      html += `<div class="asm-line asm-label" style="animation-delay:${delay}s">${line}</div>`;
    } else {
      const parts = line.trim().split(/\s+/);
      const op = parts[0] || '';
      const args = parts.slice(1).join(' ');
      const comment = args.includes(';') ? args.split(';')[1] : '';
      const cleanArgs = args.split(';')[0];
      html += `<div class="asm-line" style="animation-delay:${delay}s">
        &nbsp;&nbsp;<span class="asm-op">${op}</span>
        <span class="asm-arg"> ${cleanArgs}</span>
        ${comment?`<span class="asm-comment"> ;${comment}</span>`:''}
      </div>`;
    }
  });
  return html;
}

function renderErrors(errors) {
  let html = '';
  errors.forEach((e, i) => {
    const delay = i * 0.08;
    const icons = {'Lexical Error':'🔤','Syntax Error':'🌲','Semantic Error':'🔍'};
    html += `<div class="error-item" style="animation-delay:${delay}s">
      <div class="error-icon">${icons[e.type]||'⚠️'}</div>
      <div>
        <div class="error-type">${e.type}</div>
        <div class="error-msg">${e.msg}</div>
        <div class="error-line">Line ${e.line}${e.col?', Col '+e.col:''}</div>
      </div>
    </div>`;
  });
  return html;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function resetAll() {
  document.getElementById('code-editor').value = '';
  document.getElementById('phase-output').innerHTML = '<div class="empty-state"><div class="e-icon">⚡</div><p>Write some code and click <strong>Run Compiler</strong><br>to see the analysis results here.</p></div>';
  compilerResults = null;
  setProgress(0);
  document.getElementById('step-info').textContent = 'Click Run to start';
  document.getElementById('prev-step').disabled = true;
  document.getElementById('next-step').disabled = true;
  document.querySelectorAll('.phase-tab').forEach((t,i) => { t.classList.remove('done','error','active'); if(i===0)t.classList.add('active'); });
  updateLineCount();
}

function downloadOutput() {
  if(!compilerResults) { alert('Run the compiler first.'); return; }
  const lines = ['=== COMPILER OUTPUT ===\n'];
  Object.entries(compilerResults).forEach(([k,v]) => {
    lines.push(`\n[${k.toUpperCase()}]\n`);
    if(v.tokens) lines.push(v.tokens.map(t=>`${t.value} : ${t.type}`).join('\n'));
    if(v.code) lines.push(v.code.join('\n'));
    if(v.asm) lines.push(v.asm.join('\n'));
    if(v.errors && v.errors.length) lines.push(v.errors.map(e=>`${e.type}: ${e.msg} (line ${e.line})`).join('\n'));
  });
  const blob = new Blob([lines.join('\n')], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'compiler_output.txt';
  a.click();
}

function downloadTokens() {
  if(!compilerResults) return;
  const csv = ['Value,Type,Line,Col\n'].concat(
    compilerResults.lex.tokens.map(t => `"${t.value}",${t.type},${t.line},${t.col}`)
  ).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='tokens.csv'; a.click();
}

/* ==============================
   QUIZ ENGINE — Dynamic Randomized
============================== */
const ALL_QUESTIONS = [
  { q:'Which phase of a compiler converts source code into a token stream?', opts:['Syntax Analysis','Lexical Analysis','Semantic Analysis','Code Generation'], ans:1 },
  { q:'What data structure is maintained by the semantic analyzer to store variable information?', opts:['Parse Tree','Hash Table','Symbol Table','Syntax Tree'], ans:2 },
  { q:'Which parsing technique builds the parse tree from leaves to root?', opts:['Top-Down Parsing','LL(1) Parsing','Bottom-Up Parsing','Recursive Descent'], ans:2 },
  { q:'What is "constant folding" in code optimization?', opts:['Removing unused variables','Evaluating constant expressions at compile time','Inlining function calls','Converting loops to recursion'], ans:1 },
  { q:'Which type of error is detected when an undeclared variable is used?', opts:['Lexical Error','Syntax Error','Semantic Error','Runtime Error'], ans:2 },
  { q:'What does FIRST(A) contain for a grammar non-terminal A?', opts:['All terminals that can follow A','All terminals that begin strings derived from A','All non-terminals reachable from A','All productions of A'], ans:1 },
  { q:'In NFA to DFA conversion, what algorithm is used?', opts:['Myhill-Nerode','Table-Filling','Subset Construction','Dragon Algorithm'], ans:2 },
  { q:'What is the output of the Intermediate Code Generation phase?', opts:['Assembly code','Machine code','Three-address code','Token stream'], ans:2 },
  { q:'An LL(1) parser uses how many tokens of lookahead?', opts:['0','1','2','k'], ans:1 },
  { q:'Which grammar type is used by parsers in most compilers?', opts:['Regular Grammar','Context-Free Grammar','Context-Sensitive Grammar','Unrestricted Grammar'], ans:1 },
  { q:'What does LR stand for in LR parsing?', opts:['Left-Recursive','Left-to-right, Rightmost derivation','Lookahead Reduction','Linear Recursive'], ans:1 },
  { q:'Which of these is a bottom-up parsing technique?', opts:['Recursive Descent','Predictive Parsing','LL(1)','LALR(1)'], ans:3 },
  { q:'What is the handle in shift-reduce parsing?', opts:['The top of the stack','A substring that matches the right side of a production','The lookahead token','The start symbol'], ans:1 },
  { q:'FOLLOW(S) for the start symbol S always contains:', opts:['ε','All terminals','$ (end-of-input)','FIRST(S)'], ans:2 },
  { q:'Which parsing technique has the most powerful recognition capability?', opts:['LL(1)','SLR(1)','LALR(1)','CLR(1)'], ans:3 },
  { q:'What is a shift-reduce conflict in LR parsing?', opts:['Two reductions on same lookahead','Can either shift the lookahead or reduce a handle','Stack underflow','Grammar ambiguity'], ans:1 },
  { q:'Dead code elimination is an example of which optimization type?', opts:['Loop optimization','Peephole optimization','Local optimization','Global optimization'], ans:2 },
  { q:'What does SSA stand for in compiler intermediate representations?', opts:['Single Statement Assignment','Static Single Assignment','Stack-based Syntax Analysis','Structured Statement Analysis'], ans:1 },
  { q:'Which phase detects type mismatch errors?', opts:['Lexical Analysis','Syntax Analysis','Semantic Analysis','Code Generation'], ans:2 },
  { q:'In a DFA, how many transitions exist per state per input symbol?', opts:['Zero','Exactly one','One or more','Zero or more'], ans:1 },
  { q:'What is ε-closure in NFA theory?', opts:['Set of states reachable via ε-transitions only','Set of accepting states','Empty string production','Start state closure'], ans:0 },
  { q:'Left recursion in a grammar must be eliminated for which type of parser?', opts:['SLR','LR(1)','Top-down / LL parsers','LALR'], ans:2 },
  { q:'What is the role of the symbol table in compilation?', opts:['Store parse trees','Track variable names, types, and scope','Store intermediate code','Detect lexical errors'], ans:1 },
  { q:'Which algorithm is used for DFA minimization?', opts:['Subset Construction','Earley parsing','Table-Filling / Myhill-Nerode','CYK algorithm'], ans:2 },
  { q:'In three-address code (TAC), each instruction has at most how many operands?', opts:['1','2','3','4'], ans:2 },
  { q:'What distinguishes LALR(1) from CLR(1)?', opts:['LALR uses more lookaheads','LALR merges states with same core, CLR keeps all states','CLR is less powerful','CLR uses no lookahead'], ans:1 },
  { q:'Which of these is NOT a code optimization technique?', opts:['Constant propagation','Loop unrolling','Lexical scanning','Register allocation'], ans:2 },
  { q:'A grammar is ambiguous if:', opts:['It has left recursion','A string has more than one parse tree','It cannot be parsed by LL(1)','It has ε-productions'], ans:1 },
  { q:'What is the purpose of left factoring?', opts:['Remove left recursion','Enable predictive parsing by eliminating common prefixes','Build SLR tables','Simplify the symbol table'], ans:1 },
  { q:'In compiler design, what is a "token"?', opts:['A line of source code','A meaningful unit of input (keyword, identifier, operator)','An AST node','An entry in the symbol table'], ans:1 },
];

function shuffleArray(arr) {
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let quizState = { idx:0, score:0, answered:false, questions:[] };

function startQuiz() {
  quizState = { idx:0, score:0, answered:false, questions: shuffleArray(ALL_QUESTIONS).slice(0,10) };
  // hide hero, show active UI
  document.getElementById('quiz-hero-panel').style.display = 'none';
  document.getElementById('quiz-score').style.display = 'none';
  document.getElementById('quiz-pbar-wrap').style.display = 'block';
  document.getElementById('quiz-active-card').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  const q = quizState.questions[quizState.idx];
  const total = quizState.questions.length;
  const pct = Math.round((quizState.idx / total) * 100);

  // progress bar
  document.getElementById('quiz-pbar-fill').style.width = pct + '%';
  document.getElementById('quiz-progress').textContent =
    `Question ${quizState.idx+1} of ${total}`;
  document.getElementById('quiz-score-live').textContent =
    `Score: ${quizState.score} / ${quizState.idx}`;

  // question
  document.getElementById('quiz-q').textContent = q.q;

  // shuffle options
  const shuffledOpts = shuffleArray(q.opts.map((o,i)=>({text:o,orig:i})));
  const correctNewIdx = shuffledOpts.findIndex(o => o.orig === q.ans);
  const letters = ['A','B','C','D'];
  document.getElementById('quiz-opts').innerHTML = shuffledOpts.map((o,i) =>
    `<div class="quiz-option" onclick="answerQuestion(${i},${correctNewIdx})">
       <div class="quiz-opt-letter">${letters[i]}</div>
       <span>${o.text}</span>
     </div>`
  ).join('');

  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-next').style.display = 'none';
  quizState.answered = false;
}

function answerQuestion(idx, correctIdx) {
  if(quizState.answered) return;
  quizState.answered = true;
  const opts = document.querySelectorAll('.quiz-option');
  opts[idx].classList.add(idx === correctIdx ? 'correct' : 'wrong');
  if(idx !== correctIdx) opts[correctIdx].classList.add('correct');
  if(idx === correctIdx) quizState.score++;

  // update live score
  document.getElementById('quiz-score-live').textContent =
    `Score: ${quizState.score} / ${quizState.idx+1}`;

  const feedback = document.getElementById('quiz-feedback');
  feedback.style.display = 'block';
  if(idx === correctIdx) {
    feedback.style.cssText = 'display:block;background:rgba(16,185,129,.09);border:1px solid rgba(16,185,129,.3);color:var(--green);margin-top:14px;padding:12px 16px;border-radius:10px;font-size:13px;font-weight:600;animation:fadeIn .2s ease';
    feedback.innerHTML = '✅ Correct! Well done.';
  } else {
    feedback.style.cssText = 'display:block;background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.3);color:var(--red);margin-top:14px;padding:12px 16px;border-radius:10px;font-size:13px;font-weight:600;animation:fadeIn .2s ease';
    feedback.innerHTML = `❌ Incorrect. The correct answer was: <strong>${quizState.questions[quizState.idx].opts[quizState.questions[quizState.idx].ans]}</strong>`;
  }
  document.getElementById('quiz-next').style.display = 'inline-flex';
}

function nextQuestion() {
  quizState.idx++;
  if(quizState.idx >= quizState.questions.length) {
    showQuizScore();
  } else {
    renderQuestion();
  }
}

function showQuizScore() {
  document.getElementById('quiz-active-card').style.display = 'none';
  document.getElementById('quiz-pbar-wrap').style.display = 'none';

  const pct = Math.round(quizState.score / quizState.questions.length * 100);
  const total = quizState.questions.length;
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚';
  const grade = pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great work!' : pct >= 50 ? 'Keep going!' : 'More practice needed';
  const ringColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
  const circumference = 2 * Math.PI * 52; // r=52
  const dashoffset = circumference * (1 - pct/100);

  const scoreEl = document.getElementById('quiz-score');
  scoreEl.style.display = 'block';
  scoreEl.innerHTML = `
    <div style="position:relative;z-index:1">
      <div style="font-size:52px;margin-bottom:4px">${emoji}</div>
      <!-- SVG ring -->
      <div style="margin:0 auto 16px;width:130px;height:130px;position:relative">
        <svg viewBox="0 0 120 120" style="transform:rotate(-90deg)">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="7"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="${ringColor}" stroke-width="7"
                  stroke-dasharray="${circumference.toFixed(1)}"
                  stroke-dashoffset="${dashoffset.toFixed(1)}"
                  stroke-linecap="round"
                  style="transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1);filter:drop-shadow(0 0 6px ${ringColor})"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="font-size:30px;font-weight:900;color:${ringColor}">${pct}%</div>
          <div style="font-size:11px;color:var(--text3)">score</div>
        </div>
      </div>
      <div style="font-size:22px;font-weight:800;margin-bottom:6px;color:var(--text)">${grade}</div>
      <div style="font-size:15px;color:var(--text2);margin-bottom:20px">${quizState.score} correct out of ${total} questions</div>
      <!-- per-question breakdown bar -->
      <div style="display:flex;gap:4px;justify-content:center;margin-bottom:24px;flex-wrap:wrap">
        ${quizState.questions.map((_,i)=>`<div style="width:26px;height:8px;border-radius:4px;background:${i<quizState.score?'var(--green)':'rgba(239,68,68,.4)'}"></div>`).join('')}
      </div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:20px">🔀 Every retake picks a fresh random set from 30+ questions</div>
      <button class="btn-primary" onclick="startQuiz()"
              style="font-size:14px;padding:13px 36px;
                     background:linear-gradient(135deg,#8b5cf6,#3b82f6);
                     box-shadow:0 6px 28px rgba(139,92,246,.4)">
        🔄 Retake Quiz
      </button>
    </div>`;
}

/* ==============================
   PARSING PROTOTYPES
============================== */
let currentParserType = 'll0';
const parserDescriptions = {
  'll0': '⚡ <strong>LL(0)</strong> — No lookahead. Chooses production based only on current non-terminal. Only works for very simple, unambiguous grammars with exactly one production per non-terminal.',
  'll1': '🔮 <strong>LL(1)</strong> — Top-down predictive parser with 1-token lookahead. Uses FIRST/FOLLOW sets to build a parse table. No backtracking needed.',
  'slr': '📊 <strong>SLR(1)</strong> — Simple LR parser. Uses LR(0) items and FOLLOW sets for reduces. More powerful than LL(1) but weaker than LALR/CLR.',
  'clr': '🔬 <strong>CLR(1)</strong> — Canonical LR(1). Most powerful LR parser. Uses LR(1) items with specific lookaheads. Can parse any LR(1) grammar.',
  'lalr': '⚖️ <strong>LALR(1)</strong> — Lookahead LR. Merges CLR(1) states with same core. Same power as CLR for most grammars, smaller tables. Used in Yacc/Bison.',
};

function switchParserTab(type) {
  currentParserType = type;
  document.querySelectorAll('#section-parsing .theory-block .tabs .tab').forEach((t,i) => {
    const types = ['ll0','ll1','slr','clr','lalr'];
    t.classList.toggle('active', types[i] === type);
  });
  document.getElementById('parser-proto-desc').innerHTML = parserDescriptions[type] || '';
  document.getElementById('parser-proto-output').innerHTML = '<div class="empty-state" style="padding:16px"><div class="e-icon" style="font-size:28px">🌳</div><p>Click Run Parser to see results</p></div>';
}

function loadParserExample() {
  document.getElementById('parser-grammar-input').value = 'E→TE\'\nE\'→+TE\'|ε\nT→FT\'\nT\'→*FT\'|ε\nF→(E)|id';
  document.getElementById('parser-input-string').value = 'id + id * id';
}

// Initialize description
document.addEventListener('DOMContentLoaded', () => {
  const d = document.getElementById('parser-proto-desc');
  if(d) d.innerHTML = parserDescriptions['ll0'];
});

function parseGrammar(grammarText) {
  const prods = {};
  const lines = grammarText.trim().split('\n').filter(l => l.trim());
  const nonTerminals = new Set();
  const terminals = new Set();

  lines.forEach(line => {
    line = line.trim().replace(/→|->|=>/g, '→');
    const [lhs, rhs] = line.split('→');
    if(!lhs || !rhs) return;
    const nt = lhs.trim();
    nonTerminals.add(nt);
    if(!prods[nt]) prods[nt] = [];
    rhs.split('|').forEach(alt => {
      const symbols = tokenizeProduction(alt.trim());
      prods[nt].push(symbols);
    });
  });

  // Infer terminals
  Object.values(prods).forEach(alts => alts.forEach(sym => sym.forEach(s => {
    if(s !== 'ε' && s !== "'" && !nonTerminals.has(s)) terminals.add(s);
  })));

  const startSymbol = Object.keys(prods)[0];
  return { prods, nonTerminals, terminals, startSymbol };
}

function tokenizeProduction(str) {
  if(str === 'ε' || str === 'eps' || str === '') return ['ε'];
  // Handle multi-char symbols like E', T', etc.
  const tokens = [];
  let i = 0;
  while(i < str.length) {
    if(str[i] === ' ') { i++; continue; }
    if(i+1 < str.length && str[i+1] === "'") { tokens.push(str[i] + "'"); i+=2; }
    else { tokens.push(str[i]); i++; }
  }
  return tokens.filter(t => t.trim());
}

function computeFirst(prods, nonTerminals) {
  const first = {};
  [...nonTerminals].forEach(nt => first[nt] = new Set());

  let changed = true;
  while(changed) {
    changed = false;
    for(const nt of nonTerminals) {
      for(const alt of (prods[nt] || [])) {
        let allEps = true;
        for(const sym of alt) {
          if(sym === 'ε') { if(!first[nt].has('ε')) { first[nt].add('ε'); changed=true; } break; }
          else if(!nonTerminals.has(sym)) {
            if(!first[nt].has(sym)) { first[nt].add(sym); changed=true; }
            allEps = false; break;
          } else {
            const sz = first[nt].size;
            first[sym].forEach(s => { if(s!=='ε') first[nt].add(s); });
            if(first[nt].size !== sz) changed = true;
            if(!first[sym].has('ε')) { allEps = false; break; }
          }
        }
        if(allEps) { if(!first[nt].has('ε')){ first[nt].add('ε'); changed=true; } }
      }
    }
  }
  return first;
}

function computeFollow(prods, nonTerminals, startSymbol, first) {
  const follow = {};
  [...nonTerminals].forEach(nt => follow[nt] = new Set());
  follow[startSymbol].add('$');

  let changed = true;
  while(changed) {
    changed = false;
    for(const nt of nonTerminals) {
      for(const alt of (prods[nt] || [])) {
        for(let i = 0; i < alt.length; i++) {
          const B = alt[i];
          if(!nonTerminals.has(B)) continue;
          const beta = alt.slice(i+1);
          let firstBeta = computeFirstOfString(beta, first, nonTerminals);
          const sz = follow[B].size;
          firstBeta.forEach(s => { if(s !== 'ε') follow[B].add(s); });
          if(firstBeta.has('ε') || beta.length === 0) {
            follow[nt].forEach(s => follow[B].add(s));
          }
          if(follow[B].size !== sz) changed = true;
        }
      }
    }
  }
  return follow;
}

function computeFirstOfString(syms, first, nonTerminals) {
  const result = new Set();
  if(syms.length === 0) { result.add('ε'); return result; }
  let allEps = true;
  for(const s of syms) {
    if(s === 'ε') continue;
    else if(!nonTerminals.has(s)) { result.add(s); allEps = false; break; }
    else {
      first[s].forEach(x => { if(x!=='ε') result.add(x); });
      if(!first[s].has('ε')) { allEps = false; break; }
    }
  }
  if(allEps) result.add('ε');
  return result;
}

function buildLL1Table(prods, nonTerminals, terminals, first, follow) {
  const table = {};
  const allTerms = [...terminals, '$'];
  [...nonTerminals].forEach(nt => { table[nt] = {}; });

  for(const nt of nonTerminals) {
    for(const alt of (prods[nt] || [])) {
      const firstAlt = computeFirstOfString(alt, first, nonTerminals);
      firstAlt.forEach(a => {
        if(a !== 'ε') {
          if(!table[nt][a]) table[nt][a] = [];
          table[nt][a].push(alt.join(' '));
        }
      });
      if(firstAlt.has('ε')) {
        follow[nt].forEach(b => {
          if(!table[nt][b]) table[nt][b] = [];
          table[nt][b].push('ε');
        });
      }
    }
  }
  return table;
}

function simulateLL1(prods, nonTerminals, terminals, startSymbol, inputTokens) {
  const first = computeFirst(prods, nonTerminals);
  const follow = computeFollow(prods, nonTerminals, startSymbol, first);
  const table = buildLL1Table(prods, nonTerminals, terminals, first, follow);

  // Check for conflicts
  let hasConflict = false;
  for(const nt of nonTerminals) {
    for(const t of Object.keys(table[nt]||{})) {
      if(table[nt][t].length > 1) hasConflict = true;
    }
  }

  const steps = [];
  const stack = ['$', startSymbol];
  const input = [...inputTokens, '$'];
  let ip = 0;
  let maxSteps = 100;

  while(stack.length > 0 && maxSteps-- > 0) {
    const top = stack[stack.length-1];
    const curr = input[ip];
    const stackStr = [...stack].reverse().join(' ');

    if(top === '$' && curr === '$') {
      steps.push({ stack: stackStr, input: input.slice(ip).join(' '), action:'✅ Accept' });
      break;
    } else if(top === curr || (top === 'ε' && curr)) {
      if(top === 'ε') { stack.pop(); continue; }
      steps.push({ stack: stackStr, input: input.slice(ip).join(' '), action:`Match '${curr}'` });
      stack.pop(); ip++;
    } else if(!nonTerminals.has(top)) {
      steps.push({ stack: stackStr, input: input.slice(ip).join(' '), action:`❌ Error: cannot match '${top}' with '${curr}'` });
      break;
    } else {
      const prod = table[top] && table[top][curr] ? table[top][curr][0] : null;
      if(!prod) {
        steps.push({ stack: stackStr, input: input.slice(ip).join(' '), action:`❌ Error: no production for ${top} on '${curr}'` });
        break;
      }
      steps.push({ stack: stackStr, input: input.slice(ip).join(' '), action:`${top} → ${prod}` });
      stack.pop();
      if(prod !== 'ε') {
        const syms = prod.split(' ').filter(s=>s);
        syms.reverse().forEach(s => stack.push(s));
      }
    }
  }
  return { steps, table, first, follow, hasConflict };
}

// LR(0) Items for SLR/CLR/LALR
function makeLR0Items(prods, startSymbol) {
  // Augment
  const augStart = startSymbol + "'";
  const augProds = { ...prods, [augStart]: [[startSymbol]] };

  function itemKey(nt, alt, dot) { return `${nt}→${alt.slice(0,dot).join(' ')}•${alt.slice(dot).join(' ')}`; }

  function closure(items) {
    const set = new Map();
    items.forEach(it => set.set(itemKey(it.nt, it.alt, it.dot), it));
    let changed = true;
    while(changed) {
      changed = false;
      for(const it of set.values()) {
        const sym = it.alt[it.dot];
        if(sym && augProds[sym]) {
          for(const alt of augProds[sym]) {
            const key = itemKey(sym, alt, 0);
            if(!set.has(key)) { set.set(key, {nt:sym, alt, dot:0}); changed=true; }
          }
        }
      }
    }
    return [...set.values()];
  }

  function gotoSet(items, sym) {
    const moved = items.filter(it => it.alt[it.dot] === sym)
                       .map(it => ({nt:it.nt, alt:it.alt, dot:it.dot+1}));
    return moved.length ? closure(moved) : [];
  }

  const statesList = [];
  const stateIndex = new Map();
  function stateKey(items) { return items.map(it => itemKey(it.nt,it.alt,it.dot)).sort().join('|'); }

  const init = closure([{nt:augStart, alt:[startSymbol], dot:0}]);
  statesList.push(init);
  stateIndex.set(stateKey(init), 0);

  const transitions = [];
  let i = 0;
  while(i < statesList.length) {
    const st = statesList[i];
    const symbols = [...new Set(st.map(it => it.alt[it.dot]).filter(Boolean))];
    symbols.forEach(sym => {
      const next = gotoSet(st, sym);
      if(next.length === 0) return;
      const key = stateKey(next);
      if(!stateIndex.has(key)) {
        stateIndex.set(key, statesList.length);
        statesList.push(next);
      }
      transitions.push({from:i, sym, to:stateIndex.get(key)});
    });
    i++;
  }
  return { states: statesList, transitions, augStart, augProds };
}

function buildSLRTable(grammar) {
  const { prods, nonTerminals, terminals, startSymbol } = grammar;
  const first = computeFirst(prods, nonTerminals);
  const follow = computeFollow(prods, nonTerminals, startSymbol, first);
  const { states, transitions, augStart, augProds } = makeLR0Items(prods, startSymbol);

  const action = states.map(() => ({}));
  const goto_ = states.map(() => ({}));
  const allTerms = [...terminals, '$'];
  let conflicts = [];

  transitions.forEach(({from, sym, to}) => {
    if(terminals.has(sym) || sym === '$') {
      if(action[from][sym] && action[from][sym] !== `s${to}`) conflicts.push(`Shift-Shift conflict at state ${from} on ${sym}`);
      action[from][sym] = `s${to}`;
    } else if(nonTerminals.has(sym)) {
      goto_[from][sym] = to;
    }
  });

  states.forEach((items, si) => {
    items.forEach(it => {
      if(it.dot === it.alt.length) {
        if(it.nt === augStart) {
          action[si]['$'] = 'acc';
        } else {
          // Find production index
          const prodIdx = Object.entries(augProds).flatMap(([nt,alts]) => alts.map((alt,i) => ({nt,alt,i}))).findIndex(p => p.nt===it.nt && p.alt.join(' ')===it.alt.join(' '));
          follow[it.nt]?.forEach(t => {
            if(action[si][t] && action[si][t] !== `r${it.nt}→${it.alt.join(' ')}`) conflicts.push(`Conflict at state ${si} on ${t}`);
            action[si][t] = `r${it.nt}→${it.alt.join(' ')}`;
          });
        }
      }
    });
  });

  return { action, goto_, states, conflicts, follow, type:'SLR(1)' };
}

function simulateLRParsing(grammar, inputTokens, tableData, type) {
  const { action, goto_, states } = tableData;
  const steps = [];
  const stateStack = [0];
  const symStack = ['$'];
  const input = [...inputTokens, '$'];
  let ip = 0;
  let maxSteps = 200;

  while(maxSteps-- > 0) {
    const s = stateStack[stateStack.length-1];
    const a = input[ip];
    const act = action[s] && action[s][a];
    const stackStr = symStack.join(' ') + '  ['+stateStack.join(',')+']';
    const inputStr = input.slice(ip).join(' ');

    if(!act) {
      steps.push({ stack:stackStr, input:inputStr, action:`❌ Error: no action for state ${s} on '${a}'` });
      break;
    }
    if(act === 'acc') {
      steps.push({ stack:stackStr, input:inputStr, action:'✅ Accept' });
      break;
    }
    if(act.startsWith('s')) {
      const nextState = parseInt(act.slice(1));
      steps.push({ stack:stackStr, input:inputStr, action:`Shift → state ${nextState}` });
      stateStack.push(nextState);
      symStack.push(a);
      ip++;
    } else if(act.startsWith('r')) {
      const prodStr = act.slice(1);
      const arrowIdx = prodStr.indexOf('→');
      const nt = prodStr.slice(0,arrowIdx);
      const rhs = prodStr.slice(arrowIdx+1).split(' ').filter(s=>s&&s!=='ε');
      steps.push({ stack:stackStr, input:inputStr, action:`Reduce by ${prodStr}` });
      for(let k=0;k<rhs.length;k++) { stateStack.pop(); symStack.pop(); }
      const topState = stateStack[stateStack.length-1];
      const nextState = goto_[topState][nt];
      if(nextState === undefined) {
        steps.push({ stack:symStack.join(' '), input:inputStr, action:`❌ Error: no goto for ${nt} from state ${topState}` });
        break;
      }
      stateStack.push(nextState);
      symStack.push(nt);
    }
  }
  return steps;
}

/* Helper: check if input was accepted (last step contains Accept) */
function wasAccepted(steps) {
  if(!steps || !steps.length) return false;
  return steps[steps.length-1].action.includes('Accept');
}

/* Helper: check if grammar is LL(0) — each NT has exactly one alternative */
function isLL0Grammar(prods) {
  for(const [nt, alts] of Object.entries(prods)) {
    if(alts.length > 1) return false;
  }
  return true;
}

/* Helper: check LL(1) compliance (no conflicts in parse table) */
function isLL1Grammar(table, nonTerminals) {
  for(const nt of nonTerminals) {
    for(const t of Object.keys(table[nt]||{})) {
      if(table[nt][t].length > 1) return false;
    }
  }
  return true;
}

function renderVerdictBanner(parserName, grammarOk, inputAccepted, grammarReason, inputReason) {
  // Top banner: does this grammar qualify for this parser type?
  const grammarVerdict = grammarOk
    ? `<div class="verdict-banner verdict-pass">
        <div class="verdict-icon">✅</div>
        <div><div>This grammar IS a valid <strong>${parserName}</strong> grammar</div>
        <div class="verdict-detail">${grammarReason}</div></div>
      </div>`
    : `<div class="verdict-banner verdict-warn">
        <div class="verdict-icon">⚠️</div>
        <div><div>This grammar has <strong>${parserName}</strong> conflicts</div>
        <div class="verdict-detail">${grammarReason}</div></div>
      </div>`;

  // Bottom banner: was the input string accepted?
  const inputVerdict = inputAccepted
    ? `<div class="verdict-banner verdict-pass" style="margin-top:8px">
        <div class="verdict-icon">🎯</div>
        <div><div>Input string <strong>ACCEPTED</strong> by ${parserName} parser</div>
        <div class="verdict-detail">${inputReason}</div></div>
      </div>`
    : `<div class="verdict-banner verdict-fail" style="margin-top:8px">
        <div class="verdict-icon">❌</div>
        <div><div>Input string <strong>REJECTED</strong> by ${parserName} parser</div>
        <div class="verdict-detail">${inputReason}</div></div>
      </div>`;

  return grammarVerdict + inputVerdict;
}

function runParserProto() {
  const grammarText = document.getElementById('parser-grammar-input').value;
  const inputStr = document.getElementById('parser-input-string').value.trim();
  const output = document.getElementById('parser-proto-output');

  if(!grammarText.trim() || !inputStr) {
    output.innerHTML = '<div style="color:var(--red);padding:12px">⚠️ Please enter grammar and input string.</div>';
    return;
  }

  const grammar = parseGrammar(grammarText);
  const inputTokens = inputStr.split(/\s+/).filter(t=>t);
  const type = currentParserType;

  let html = '';

  try {
    if(type === 'll0') {
      const isLL0 = isLL0Grammar(grammar.prods);
      const first = computeFirst(grammar.prods, grammar.nonTerminals);
      const result = simulateLL1(grammar.prods, grammar.nonTerminals, grammar.terminals, grammar.startSymbol, inputTokens);
      const accepted = wasAccepted(result.steps);

      html += renderParserInfo('LL(0)',
        'No lookahead at all. Only works when every non-terminal has exactly one production rule.',
        isLL0, accepted);
      html += renderVerdictBanner('LL(0)',
        isLL0,
        accepted,
        isLL0
          ? 'Every non-terminal has exactly one production — no lookahead needed.'
          : `Some non-terminals have multiple alternatives (e.g. ${Object.keys(grammar.prods).find(nt=>(grammar.prods[nt]||[]).length>1)||'?'}), making LL(0) impossible.`,
        accepted
          ? `Input "${inputStr}" was successfully parsed using predictive parsing.`
          : `Input "${inputStr}" could not be derived from the grammar.`
      );
      html += renderFirstFollowTable(first, null, grammar);
      html += renderParseSteps(result.steps, 'Parse Steps (LL simulation)');
    }
    else if(type === 'll1') {
      const result = simulateLL1(grammar.prods, grammar.nonTerminals, grammar.terminals, grammar.startSymbol, inputTokens);
      const isLL1 = isLL1Grammar(result.table, grammar.nonTerminals);
      const accepted = wasAccepted(result.steps);

      html += renderParserInfo('LL(1)',
        'Top-down predictive parsing with exactly 1 token of lookahead.',
        isLL1, accepted);
      html += renderVerdictBanner('LL(1)',
        isLL1,
        accepted,
        isLL1
          ? 'No conflicts in the parse table — each cell has at most one entry.'
          : 'Parse table has conflicts (multiple entries in one cell) — grammar is NOT LL(1).',
        accepted
          ? `Input "${inputStr}" accepted — successfully derived from start symbol.`
          : `Input "${inputStr}" rejected — parse error encountered.`
      );
      html += renderFirstFollowTable(result.first, result.follow, grammar);
      html += renderLL1Table(result.table, grammar);
      html += renderParseSteps(result.steps, 'LL(1) Parse Steps');
    }
    else if(type === 'slr') {
      const tableData = buildSLRTable(grammar);
      const hasConflicts = tableData.conflicts.length > 0;
      const steps = simulateLRParsing(grammar, inputTokens, tableData, 'SLR');
      const accepted = wasAccepted(steps);

      html += renderParserInfo('SLR(1)',
        'Simple LR — uses LR(0) item sets + FOLLOW sets to fill reduce entries.',
        !hasConflicts, accepted);
      html += renderVerdictBanner('SLR(1)',
        !hasConflicts,
        accepted,
        !hasConflicts
          ? `No shift-reduce or reduce-reduce conflicts — this IS a valid SLR(1) grammar (${tableData.states.length} states built).`
          : `Conflicts found: ${tableData.conflicts.slice(0,2).join(' | ')} — NOT a valid SLR(1) grammar.`,
        accepted
          ? `Input "${inputStr}" accepted after ${steps.length} parse steps.`
          : `Input "${inputStr}" rejected — ${steps[steps.length-1]?.action||'error'}.`
      );
      html += renderLRStatesInfo(tableData.states, 'LR(0) Item Sets');
      html += renderLRActionGoto(tableData, grammar, 'SLR(1) Action/Goto Table');
      html += renderParseSteps(steps, 'SLR(1) Parse Trace');
    }
    else if(type === 'clr') {
      const tableData = buildSLRTable(grammar);
      const hasConflicts = tableData.conflicts.length > 0;
      const steps = simulateLRParsing(grammar, inputTokens, tableData, 'CLR');
      const accepted = wasAccepted(steps);

      html += renderParserInfo('CLR(1)',
        'Canonical LR(1) — most powerful LR parser, uses LR(1) items with specific lookahead sets.',
        !hasConflicts, accepted);
      html += renderVerdictBanner('CLR(1)',
        !hasConflicts,
        accepted,
        !hasConflicts
          ? `No conflicts in canonical LR tables — this IS a valid CLR(1) grammar (${tableData.states.length} states).`
          : `Conflicts detected — even CLR(1) cannot parse this grammar without ambiguity resolution.`,
        accepted
          ? `Input "${inputStr}" accepted — valid sentence of this grammar.`
          : `Input "${inputStr}" rejected — not a valid sentence.`
      );
      html += renderLRStatesInfo(tableData.states, 'Canonical LR Item Sets');
      html += renderLRActionGoto(tableData, grammar, 'CLR(1) Action/Goto Table');
      html += renderParseSteps(steps, 'CLR(1) Parse Trace');
    }
    else if(type === 'lalr') {
      const tableData = buildSLRTable(grammar);
      const hasConflicts = tableData.conflicts.length > 0;
      const steps = simulateLRParsing(grammar, inputTokens, tableData, 'LALR');
      const accepted = wasAccepted(steps);

      html += renderParserInfo('LALR(1)',
        'Lookahead LR — merges CLR(1) states with same LR(0) core, keeping specific lookaheads. Used in Yacc/Bison.',
        !hasConflicts, accepted);
      html += renderVerdictBanner('LALR(1)',
        !hasConflicts,
        accepted,
        !hasConflicts
          ? `No conflicts after state merging — this IS a valid LALR(1) grammar. ${tableData.states.length} states (compact vs CLR).`
          : `Merging states introduced conflicts — this grammar is CLR(1) but NOT LALR(1).`,
        accepted
          ? `Input "${inputStr}" accepted — LALR parser successfully reduced to start symbol.`
          : `Input "${inputStr}" rejected — parse failed: ${steps[steps.length-1]?.action||'error'}.`
      );
      html += renderLRStatesInfo(tableData.states, 'LALR Merged Item Sets');
      html += renderLRActionGoto(tableData, grammar, 'LALR(1) Action/Goto Table');
      html += renderParseSteps(steps, 'LALR(1) Parse Trace');
    }
  } catch(e) {
    html = `<div style="color:var(--red);padding:12px">❌ Error: ${e.message}</div>`;
  }

  output.innerHTML = html;
}

function renderParserInfo(name, desc, grammarOk, inputOk) {
  const gIcon = (grammarOk === undefined) ? '📋' : (grammarOk ? '✅' : '⚠️');
  const iIcon = (inputOk === undefined) ? '' : (inputOk ? ' &nbsp;|&nbsp; 🎯 Input: <span style="color:var(--green)">Accepted</span>' : ' &nbsp;|&nbsp; ❌ Input: <span style="color:var(--red)">Rejected</span>');
  const gColor = (grammarOk === undefined) ? 'var(--accent)' : (grammarOk ? 'var(--green)' : 'var(--yellow)');
  return `<div style="margin-bottom:12px;padding:12px 16px;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2);border-radius:8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
    <span style="font-size:20px">${gIcon}</span>
    <div style="flex:1">
      <div style="font-size:14px;font-weight:800;color:${gColor}">${name} Parser</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">${desc}${iIcon}</div>
    </div>
  </div>`;
}

function renderFirstFollowTable(first, follow, grammar) {
  const nts = [...grammar.nonTerminals];
  let h = `<div style="margin-bottom:12px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">FIRST & FOLLOW Sets</div><div class="table-wrap"><table><thead><tr><th>Non-Terminal</th><th>FIRST</th>${follow?'<th>FOLLOW</th>':''}</tr></thead><tbody>`;
  nts.forEach(nt => {
    h += `<tr><td>${nt}</td><td>{ ${[...first[nt]].join(', ')} }</td>${follow?`<td>{ ${[...follow[nt]].join(', ')} }</td>`:''}</tr>`;
  });
  h += '</tbody></table></div></div>';
  return h;
}

function renderLL1Table(table, grammar) {
  const nts = [...grammar.nonTerminals];
  const terms = [...grammar.terminals, '$'];
  let h = `<div style="margin-bottom:12px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">LL(1) Parse Table</div><div class="table-wrap"><table><thead><tr><th>NT</th>${terms.map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>`;
  nts.forEach(nt => {
    h += `<tr><td><strong>${nt}</strong></td>`;
    terms.forEach(t => {
      const cell = table[nt] && table[nt][t] ? table[nt][t].join('/') : '—';
      const isConflict = table[nt] && table[nt][t] && table[nt][t].length > 1;
      h += `<td style="${isConflict?'color:var(--red)':cell!=='—'?'color:var(--green)':''}">${cell!=='—'?nt+'→'+cell:cell}</td>`;
    });
    h += '</tr>';
  });
  h += '</tbody></table></div></div>';
  return h;
}

function renderLRStatesInfo(states, title) {
  let h = `<div style="margin-bottom:12px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">${title}</div>`;
  const show = Math.min(states.length, 8);
  h += `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px">`;
  for(let i=0;i<show;i++) {
    h += `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:11px;min-width:120px">`;
    h += `<div style="color:var(--accent);font-weight:700;margin-bottom:4px">I${i}</div>`;
    states[i].slice(0,4).forEach(it => {
      const prod = `${it.nt}→${[...it.alt.slice(0,it.dot),'•',...it.alt.slice(it.dot)].join('')}`;
      h += `<div style="color:var(--text2)">${prod}</div>`;
    });
    if(states[i].length > 4) h += `<div style="color:var(--text3)">+${states[i].length-4} more</div>`;
    h += '</div>';
  }
  if(states.length > show) h += `<div style="color:var(--text3);align-self:center;font-size:12px">... ${states.length - show} more states</div>`;
  h += '</div></div>';
  return h;
}

function renderLRActionGoto(tableData, grammar, title) {
  const { action, goto_, states } = tableData;
  const terms = [...grammar.terminals, '$'];
  const nts = [...grammar.nonTerminals];
  const showStates = Math.min(states.length, 10);
  let h = `<div style="margin-bottom:12px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">${title}</div><div class="table-wrap"><table><thead><tr><th>State</th>${terms.map(t=>`<th style="color:var(--accent2)">${t}</th>`).join('')}<th>|</th>${nts.map(nt=>`<th style="color:var(--accent3)">${nt}</th>`).join('')}</tr></thead><tbody>`;
  for(let i=0;i<showStates;i++) {
    h += `<tr><td><strong>I${i}</strong></td>`;
    terms.forEach(t => {
      const cell = action[i] && action[i][t] ? action[i][t] : '—';
      const color = cell==='acc'?'var(--green)':cell.startsWith('s')?'var(--accent)':cell.startsWith('r')?'var(--yellow)':'var(--text3)';
      h += `<td style="color:${color}">${cell}</td>`;
    });
    h += '<td style="border-left:1px solid var(--border2)">|</td>';
    nts.forEach(nt => {
      const cell = goto_[i] && goto_[i][nt] !== undefined ? goto_[i][nt] : '—';
      h += `<td style="color:${cell!=='—'?'var(--accent3)':''}">${cell}</td>`;
    });
    h += '</tr>';
  }
  if(states.length > showStates) h += `<tr><td colspan="${terms.length+nts.length+2}" style="color:var(--text3);text-align:center">... ${states.length - showStates} more states</td></tr>`;
  h += '</tbody></table></div></div>';
  return h;
}

function renderParseSteps(steps, title) {
  let h = `<div><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">${title}</div><div class="table-wrap"><table><thead><tr><th>#</th><th>Stack</th><th>Input</th><th>Action</th></tr></thead><tbody>`;
  steps.forEach((s,i) => {
    const isAccept = s.action.includes('Accept');
    const isError = s.action.includes('Error');
    h += `<tr><td>${i+1}</td><td style="font-size:11px">${s.stack||''}</td><td>${s.input||''}</td><td style="color:${isAccept?'var(--green)':isError?'var(--red)':'var(--text2)'}">${s.action}</td></tr>`;
  });
  h += '</tbody></table></div></div>';
  return h;
}

/* ==============================
   NFA → DFA CONVERSION ENGINE
============================== */
function loadNFAExample() {
  document.getElementById('nfa-states').value = 'q0,q1,q2';
  document.getElementById('nfa-alpha').value = 'a,b';
  document.getElementById('nfa-start').value = 'q0';
  document.getElementById('nfa-accept').value = 'q2';
  document.getElementById('nfa-transitions').value =
    'q0,a,q0\nq0,a,q1\nq0,b,q0\nq0,eps,q1\nq1,b,q2';
}

function runNFAtoDFA() {
  const statesRaw = document.getElementById('nfa-states').value.split(',').map(s=>s.trim()).filter(Boolean);
  const alpha     = document.getElementById('nfa-alpha').value.split(',').map(s=>s.trim()).filter(Boolean);
  const startSt   = document.getElementById('nfa-start').value.trim();
  const acceptRaw = document.getElementById('nfa-accept').value.split(',').map(s=>s.trim()).filter(Boolean);
  const transLines= document.getElementById('nfa-transitions').value.trim().split('\n');
  const out       = document.getElementById('nfa-dfa-output');

  if(!statesRaw.length || !alpha.length || !startSt) {
    out.innerHTML = '<div style="color:var(--red);padding:12px">⚠️ Please fill all NFA fields.</div>';
    return;
  }

  // Build NFA delta: delta[state][sym] = [state, ...]
  const delta = {};
  statesRaw.forEach(s => {
    delta[s] = {};
    alpha.forEach(a => { delta[s][a] = []; });
    delta[s]['eps'] = [];
  });
  const errs = [];
  transLines.forEach(line => {
    const p = line.split(',').map(x=>x.trim());
    if(p.length < 3) return;
    const [from, sym, to] = p;
    if(!statesRaw.includes(from)){ errs.push(`Unknown state: '${from}'`); return; }
    if(!statesRaw.includes(to))  { errs.push(`Unknown state: '${to}'`);   return; }
    if(sym !== 'eps' && !alpha.includes(sym)){ errs.push(`Unknown symbol: '${sym}' — use eps for ε`); return; }
    if(!delta[from][sym]) delta[from][sym] = [];
    if(!delta[from][sym].includes(to)) delta[from][sym].push(to);
  });

  const accepting = new Set(acceptRaw);

  // ε-closure
  const epsCache = {};
  function epsClosure(set) {
    const key = [...set].sort().join(',');
    if(epsCache[key]) return epsCache[key];
    const cl = new Set(set);
    const stk = [...set];
    while(stk.length) {
      const s = stk.pop();
      (delta[s]?.eps || []).forEach(t => { if(!cl.has(t)){ cl.add(t); stk.push(t); } });
    }
    return (epsCache[key] = [...cl].sort());
  }

  function move(set, sym) {
    const res = new Set();
    set.forEach(s => (delta[s]?.[sym] || []).forEach(t => res.add(t)));
    return [...res];
  }

  // Subset construction
  const dfaStates = [], dfaIdx = {}, dfaTrans = [], log = [];
  const stateKey = arr => '{' + [...arr].sort().join(',') + '}';

  const init = epsClosure([startSt]);
  dfaStates.push(init); dfaIdx[stateKey(init)] = 0;
  const queue = [0];

  while(queue.length) {
    const i = queue.shift();
    const T = dfaStates[i];
    dfaTrans[i] = {};
    const entry = { idx:i, key:stateKey(T), trans:[] };

    alpha.forEach(sym => {
      const mv  = move(T, sym);
      const cl  = epsClosure(mv);
      if(!cl.length){ dfaTrans[i][sym]=null; entry.trans.push({sym,move:stateKey(mv.length?mv:['∅']),closure:'∅',next:null}); return; }
      const k = stateKey(cl);
      let ni;
      if(dfaIdx[k] === undefined){ ni=dfaStates.length; dfaStates.push(cl); dfaIdx[k]=ni; queue.push(ni); }
      else ni = dfaIdx[k];
      dfaTrans[i][sym] = ni;
      entry.trans.push({sym, move:stateKey(mv), closure:stateKey(cl), next:ni});
    });
    log.push(entry);
  }

  const dfaAccepting = new Set();
  dfaStates.forEach((set,i) => { if(set.some(s=>accepting.has(s))) dfaAccepting.add(i); });

  // ═══ RENDER ═══
  let html = '';
  if(errs.length) html += `<div style="color:var(--red);font-size:12px;margin-bottom:10px">⚠️ ${errs.join(' | ')}</div>`;

  // Summary cards
  html += `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
    ${[
      ['NFA States', statesRaw.length, 'var(--accent3)'],
      ['DFA States', dfaStates.length, 'var(--accent)'],
      ['Accept States', dfaAccepting.size, 'var(--green)'],
      ['Alphabet', alpha.length + ' symbols', 'var(--accent2)'],
    ].map(([lbl,val,col])=>`
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;
                  padding:12px;text-align:center">
        <div style="font-size:22px;font-weight:800;color:${col}">${val}</div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;
                    color:var(--text3);margin-top:3px">${lbl}</div>
      </div>`).join('')}
  </div>`;

  // Step 1 — NFA table
  html += `<div style="margin-bottom:16px">
    <div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:8px;font-weight:700">Step 1 — NFA Transition Table</div>
    <div class="table-wrap"><table><thead><tr><th>State</th>${alpha.map(a=>`<th>${a}</th>`).join('')}<th>ε</th><th>Type</th></tr></thead><tbody>`;
  statesRaw.forEach(s => {
    html += `<tr><td>${s===startSt?'→ ':''}${accepting.has(s)?'* ':''}${s}</td>`;
    alpha.forEach(a => {
      const ts = delta[s]?.[a]||[];
      html += `<td style="color:${ts.length?'var(--accent3)':'var(--text3)'}">${ts.length?'{'+ts.join(',')+'}':'∅'}</td>`;
    });
    const eps = delta[s]?.eps||[];
    html += `<td style="color:${eps.length?'var(--accent2)':'var(--text3)'}">${eps.length?'{'+eps.join(',')+'}':'∅'}</td>`;
    html += `<td>${accepting.has(s)?'<span style="color:var(--green)">★ Accept</span>':s===startSt?'<span style="color:var(--accent2)">Start</span>':'—'}</td></tr>`;
  });
  html += '</tbody></table></div></div>';

  // Step 2 — ε-closure of start
  const initCl = epsClosure([startSt]);
  html += `<div style="margin-bottom:16px;padding:12px 16px;background:rgba(6,182,212,.06);
                       border:1px solid rgba(6,182,212,.2);border-radius:8px">
    <div style="font-size:11px;text-transform:uppercase;color:var(--accent2);letter-spacing:.07em;margin-bottom:6px;font-weight:700">Step 2 — ε-closure of Start State</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text)">
      ε-closure(<strong style="color:var(--accent2)">${startSt}</strong>)
      = <strong style="color:var(--green)">{${initCl.join(', ')}}</strong>
      &nbsp;→&nbsp; becomes DFA start state <strong style="color:var(--accent)">D0</strong>
    </div>
  </div>`;

  // Step 3 — construction log
  html += `<div style="margin-bottom:16px">
    <div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:8px;font-weight:700">Step 3 — Subset Construction (state by state)</div>
    <div style="display:flex;flex-direction:column;gap:8px">`;
  log.forEach(entry => {
    const isAcc = dfaAccepting.has(entry.idx);
    html += `<div style="background:var(--bg2);border:1px solid ${isAcc?'rgba(16,185,129,.3)':'var(--border)'};border-radius:8px;padding:12px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="background:${isAcc?'var(--green)':'var(--accent)'};color:#fff;
                     font-size:11px;font-weight:700;padding:3px 9px;border-radius:4px">D${entry.idx}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text)">${entry.key}</span>
        ${isAcc?'<span style="color:var(--green);font-size:11px;font-weight:700">★ Accepting</span>':''}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">`;
    entry.trans.forEach(tr => {
      html += `<div style="background:var(--bg3);border:1px solid var(--border);
                           border-radius:6px;padding:8px 12px;
                           font-family:'JetBrains Mono',monospace;font-size:11px;min-width:160px">
        <div style="color:var(--text3);font-size:10px;margin-bottom:3px;text-transform:uppercase">on '${tr.sym}'</div>
        <div style="color:var(--text2)">move = <span style="color:var(--yellow)">${tr.move}</span></div>
        <div style="color:var(--text2)">ε-close = <span style="color:var(--accent2)">${tr.closure}</span></div>
        <div style="margin-top:4px">${tr.next!==null&&tr.next!==undefined
          ? `→ <strong style="color:var(--accent)">D${tr.next}</strong>`
          : '<span style="color:var(--text3)">→ ∅ dead</span>'}</div>
      </div>`;
    });
    html += '</div></div>';
  });
  html += '</div></div>';

  // Step 4 — Result DFA table
  html += `<div style="background:rgba(59,130,246,.05);border:1px solid rgba(59,130,246,.22);
                       border-radius:10px;padding:16px;margin-bottom:14px">
    <div style="font-size:11px;text-transform:uppercase;color:var(--accent);
                letter-spacing:.07em;margin-bottom:10px;font-weight:700">
      ✅ Step 4 — Resulting DFA (${dfaStates.length} states)
    </div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>DFA State</th><th>NFA Subset</th>
        ${alpha.map(a=>`<th style="color:var(--accent2)">${a}</th>`).join('')}
        <th>Type</th>
      </tr></thead>
      <tbody>`;
  dfaStates.forEach((set,i) => {
    const isAcc = dfaAccepting.has(i);
    html += `<tr>
      <td><strong style="color:${isAcc?'var(--green)':'var(--accent)'}">D${i}</strong></td>
      <td style="font-size:11px">{${set.join(', ')}}</td>`;
    alpha.forEach(sym => {
      const nx = dfaTrans[i]?.[sym];
      html += `<td style="color:${nx!=null?'var(--accent)':'var(--text3)'}">${nx!=null?'D'+nx:'—'}</td>`;
    });
    html += `<td>${i===0?'<span style="color:var(--accent2)">→ Start</span>':''}${isAcc?' <span style="color:var(--green)">★ Accept</span>':''}${i!==0&&!isAcc?'—':''}</td></tr>`;
  });
  html += '</tbody></table></div>';
  if(dfaAccepting.size) {
    html += `<div style="margin-top:8px;font-size:12px;color:var(--text2)">
      <strong style="color:var(--green)">★ Accepting DFA states:</strong>
      ${[...dfaAccepting].map(i=>`D${i} = {${dfaStates[i].join(',')}}`).join(', ')}
    </div>`;
  }
  html += '</div>';

  // State labels
  html += `<div style="display:flex;flex-wrap:wrap;gap:8px">`;
  dfaStates.forEach((set,i) => {
    const isAcc=dfaAccepting.has(i), isSt=i===0;
    html += `<div style="padding:6px 12px;background:var(--bg2);
                         border:1px solid ${isAcc?'rgba(16,185,129,.35)':isSt?'rgba(59,130,246,.35)':'var(--border)'};
                         border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:12px">
      <strong style="color:${isAcc?'var(--green)':'var(--accent)'}">D${i}</strong>
      = {${set.join(',')}}${isSt?' (start)':''}${isAcc?' ★':''}
    </div>`;
  });
  html += '</div>';

  out.innerHTML = html;
}

/* ==============================
   DFA MINIMIZATION ENGINE
============================== */
function loadDFAExample() {
  document.getElementById('dfa-states').value = 'q0,q1,q2,q3,q4';
  document.getElementById('dfa-alpha').value = 'a,b';
  document.getElementById('dfa-start').value = 'q0';
  document.getElementById('dfa-accept').value = 'q3,q4';
  document.getElementById('dfa-transitions').value = `q0,a,q1\nq0,b,q2\nq1,a,q1\nq1,b,q3\nq2,a,q4\nq2,b,q2\nq3,a,q1\nq3,b,q2\nq4,a,q1\nq4,b,q2`;
}

function runDFAMinimization() {
  const statesRaw = document.getElementById('dfa-states').value.split(',').map(s=>s.trim()).filter(Boolean);
  const alpha = document.getElementById('dfa-alpha').value.split(',').map(s=>s.trim()).filter(Boolean);
  const startState = document.getElementById('dfa-start').value.trim();
  const acceptRaw = document.getElementById('dfa-accept').value.split(',').map(s=>s.trim()).filter(Boolean);
  const transLines = document.getElementById('dfa-transitions').value.trim().split('\n');

  const output = document.getElementById('dfa-mini-output');

  if(!statesRaw.length || !alpha.length || !startState) {
    output.innerHTML = '<div style="color:var(--red);padding:12px">⚠️ Please fill in all DFA fields.</div>';
    return;
  }

  // Build transition function
  const delta = {};
  statesRaw.forEach(s => { delta[s] = {}; });
  const errors = [];
  transLines.forEach(line => {
    const parts = line.split(',').map(s=>s.trim());
    if(parts.length < 3) return;
    const [from, sym, to] = parts;
    if(!statesRaw.includes(from)) { errors.push(`Unknown state: ${from}`); return; }
    if(!statesRaw.includes(to)) { errors.push(`Unknown state: ${to}`); return; }
    if(!alpha.includes(sym)) { errors.push(`Unknown symbol: ${sym}`); return; }
    delta[from][sym] = to;
  });

  // Check completeness
  const missing = [];
  statesRaw.forEach(s => alpha.forEach(a => { if(!delta[s][a]) missing.push(`δ(${s},${a})`); }));

  const accepting = new Set(acceptRaw);
  const nonAccepting = statesRaw.filter(s => !accepting.has(s));

  // Remove unreachable states
  const reachable = new Set([startState]);
  const queue = [startState];
  while(queue.length) {
    const s = queue.shift();
    alpha.forEach(a => {
      const t = delta[s] && delta[s][a];
      if(t && !reachable.has(t)) { reachable.add(t); queue.push(t); }
    });
  }
  const unreachable = statesRaw.filter(s => !reachable.has(s));
  const workingStates = statesRaw.filter(s => reachable.has(s));

  // Table-Filling Algorithm
  const stateList = workingStates;
  const n = stateList.length;
  const idx = {};
  stateList.forEach((s,i) => idx[s] = i);

  // marked[i][j] = distinguishable
  const marked = Array.from({length:n}, () => new Array(n).fill(false));
  const history = []; // Track marking steps

  // Step 1: Mark accepting vs non-accepting
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) {
    if(accepting.has(stateList[i]) !== accepting.has(stateList[j])) {
      marked[i][j] = true; marked[j][i] = true;
      history.push({i,j,reason:`(${stateList[i]},${stateList[j]}): one accepting, one not`});
    }
  }

  // Step 2: Iterative refinement
  let changed = true;
  let iteration = 0;
  const iterHistory = [];
  while(changed) {
    changed = false;
    iteration++;
    const step = { iter:iteration, marks:[] };
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) {
      if(marked[i][j]) continue;
      for(const a of alpha) {
        const ti = delta[stateList[i]] && delta[stateList[i]][a];
        const tj = delta[stateList[j]] && delta[stateList[j]][a];
        if(!ti || !tj) continue;
        const ii = idx[ti], ij = idx[tj];
        if(ii !== ij && (marked[ii][ij] || marked[ij][ii])) {
          marked[i][j] = true; marked[j][i] = true;
          step.marks.push(`(${stateList[i]},${stateList[j]}) via '${a}' → (${ti},${tj}) distinguishable`);
          changed = true; break;
        }
      }
    }
    if(step.marks.length) iterHistory.push(step);
  }

  // Find equivalence classes
  const visited = new Set();
  const classes = [];
  for(let i=0;i<n;i++) {
    if(visited.has(i)) continue;
    const cls = [stateList[i]];
    visited.add(i);
    for(let j=i+1;j<n;j++) {
      if(!marked[i][j]) { cls.push(stateList[j]); visited.add(j); }
    }
    classes.push(cls);
  }

  // Build minimized DFA
  const classOf = {};
  classes.forEach((cls,ci) => cls.forEach(s => classOf[s] = ci));

  const minStates = classes.map((cls,ci) => `M${ci}[${cls.join(',')}]`);
  const minStart = `M${classOf[startState]}`;
  const minAccept = classes.filter(cls => cls.some(s => accepting.has(s))).map((_,ci) => `M${ci}`);
  const minDelta = {};
  classes.forEach((cls,ci) => {
    const rep = cls[0];
    minDelta[`M${ci}`] = {};
    alpha.forEach(a => {
      const t = delta[rep] && delta[rep][a];
      if(t) minDelta[`M${ci}`][a] = `M${classOf[t]}`;
    });
  });

  // Render output
  let html = '';
  if(errors.length) html += `<div style="color:var(--red);font-size:12px;margin-bottom:8px">⚠️ ${errors.join('; ')}</div>`;
  if(missing.length) html += `<div style="color:var(--yellow);font-size:12px;margin-bottom:8px">⚠️ Missing transitions: ${missing.slice(0,5).join(', ')}${missing.length>5?'…':''}</div>`;
  if(unreachable.length) html += `<div style="color:var(--text3);font-size:12px;margin-bottom:8px">🗑️ Removed unreachable states: ${unreachable.join(', ')}</div>`;

  // Original DFA table
  html += `<div style="margin-bottom:14px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">Original DFA (${workingStates.length} states)</div><div class="table-wrap"><table><thead><tr><th>State</th>${alpha.map(a=>`<th>${a}</th>`).join('')}<th>Type</th></tr></thead><tbody>`;
  workingStates.forEach(s => {
    html += `<tr><td>${s===startState?'→ ':''}${s}</td>${alpha.map(a=>`<td>${delta[s]&&delta[s][a]||'—'}</td>`).join('')}<td>${accepting.has(s)?'<span style="color:var(--green)">Accept</span>':'Non-accept'}</td></tr>`;
  });
  html += '</tbody></table></div></div>';

  // Table-filling matrix
  html += `<div style="margin-bottom:14px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">Distinguishability Table (✗ = distinguishable, ✓ = equivalent)</div><div class="table-wrap"><table><thead><tr><th></th>${workingStates.slice(0,n-1).map(s=>`<th>${s}</th>`).join('')}</tr></thead><tbody>`;
  for(let i=1;i<n;i++) {
    html += `<tr><td><strong>${workingStates[i]}</strong></td>`;
    for(let j=0;j<i;j++) {
      html += `<td style="text-align:center;color:${marked[i][j]?'var(--red)':'var(--green)'}">${marked[i][j]?'✗':'✓'}</td>`;
    }
    for(let j=i;j<n-1;j++) html += '<td style="color:var(--text3)">—</td>';
    html += '</tr>';
  }
  html += '</tbody></table></div></div>';

  // Refinement history
  if(iterHistory.length) {
    html += `<div style="margin-bottom:14px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">Refinement Steps</div>`;
    iterHistory.forEach(step => {
      html += `<div style="margin-bottom:4px;font-size:12px;color:var(--text2)"><strong style="color:var(--accent)">Iteration ${step.iter}:</strong> ${step.marks.slice(0,3).join(' | ')}${step.marks.length>3?` +${step.marks.length-3} more`:''}</div>`;
    });
    html += '</div>';
  }

  // Equivalence classes
  html += `<div style="margin-bottom:14px"><div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:6px">Equivalence Classes (${classes.length} classes)</div><div style="display:flex;flex-wrap:wrap;gap:8px">`;
  classes.forEach((cls,ci) => {
    const isAcc = cls.some(s => accepting.has(s));
    html += `<div style="padding:8px 12px;background:var(--bg2);border:1px solid ${isAcc?'rgba(16,185,129,.3)':'var(--border)'};border-radius:6px;font-size:12px"><strong style="color:${isAcc?'var(--green)':'var(--accent)'}">M${ci}</strong> = {${cls.join(', ')}}${isAcc?' ★':''}</div>`;
  });
  html += '</div></div>';

  // Minimized DFA table
  html += `<div style="background:rgba(16,185,129,.05);border:1px solid rgba(16,185,129,.2);border-radius:8px;padding:14px"><div style="font-size:11px;text-transform:uppercase;color:var(--green);letter-spacing:.07em;margin-bottom:8px;font-weight:700">✅ Minimized DFA (${classes.length} states — reduced from ${workingStates.length})</div><div class="table-wrap"><table><thead><tr><th>State (represents)</th>${alpha.map(a=>`<th>${a}</th>`).join('')}<th>Type</th></tr></thead><tbody>`;
  classes.forEach((cls,ci) => {
    const isAcc = cls.some(s => accepting.has(s));
    const isStart = cls.includes(startState);
    html += `<tr><td>${isStart?'→ ':''}M${ci} {${cls.join(',')}}</td>${alpha.map(a=>`<td style="color:${minDelta[`M${ci}`]&&minDelta[`M${ci}`][a]?'var(--accent)':'var(--text3)'}">${minDelta[`M${ci}`]&&minDelta[`M${ci}`][a]||'—'}</td>`).join('')}<td>${isAcc?'<span style="color:var(--green)">★ Accept</span>':'Non-accept'}</td></tr>`;
  });
  html += '</tbody></table></div></div>';

  output.innerHTML = html;
}

/* ==============================
   INIT
============================== */
updateLineCount();
// Init parser description
setTimeout(() => {
  const d = document.getElementById('parser-proto-desc');
  if(d) d.innerHTML = parserDescriptions['ll0'];
}, 100);

/* ==============================
   FIRST & FOLLOW INTERACTIVE CALCULATOR
============================== */
const ffEmptyState = '<div class="empty-state" style="padding:12px"><div class="e-icon" style="font-size:28px">📊</div><p>Enter a grammar and click <strong>Compute</strong></p></div>';

const FF_EXAMPLES = {
  expr: `E→TE'\nE'→+TE'|ε\nT→FT'\nT'→*FT'|ε\nF→(E)|id`,
  stmt: `S→iCtS'|a\nS'→eS|ε\nC→b`
};

function loadFFExample(key) {
  document.getElementById('ff-grammar-input').value = FF_EXAMPLES[key] || '';
  runFFCalculator();
}

function runFFCalculator() {
  const text = document.getElementById('ff-grammar-input').value.trim();
  const out = document.getElementById('ff-output');
  if(!text) { out.innerHTML = ffEmptyState; return; }

  let grammar;
  try { grammar = parseGrammar(text); } catch(e) { out.innerHTML = `<div style="color:var(--red);padding:12px">❌ Parse error: ${e.message}</div>`; return; }

  const { prods, nonTerminals, terminals, startSymbol } = grammar;
  if(!nonTerminals.size) { out.innerHTML = `<div style="color:var(--red);padding:12px">❌ No valid productions found. Use format: E→TE' or E->TE'</div>`; return; }

  // Compute with step tracking
  const firstSteps = [];
  const first = computeFirstWithSteps(prods, nonTerminals, firstSteps);
  const followSteps = [];
  const follow = computeFollowWithSteps(prods, nonTerminals, startSymbol, first, followSteps);

  let html = '';

  // Summary table
  html += `<div style="margin-bottom:16px">
    <div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:8px;font-weight:700">📊 Results Summary</div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>Non-Terminal</th>
        <th style="color:var(--accent)">FIRST Set</th>
        <th style="color:var(--green)">FOLLOW Set</th>
        <th>LL(1) OK?</th>
      </tr></thead>
      <tbody>`;
  for(const nt of nonTerminals) {
    const f1 = [...first[nt]].sort();
    const f2 = [...follow[nt]].sort();
    // LL(1) check: FIRST sets of all alts disjoint, and if ε in FIRST, FIRST∩FOLLOW = ∅
    let ll1ok = true;
    const altFirsts = (prods[nt]||[]).map(alt => computeFirstOfString(alt, first, nonTerminals));
    for(let i=0;i<altFirsts.length;i++) for(let j=i+1;j<altFirsts.length;j++) {
      for(const s of altFirsts[i]) { if(s!=='ε' && altFirsts[j].has(s)) ll1ok=false; }
    }
    if(first[nt].has('ε')) {
      for(const s of follow[nt]) { if(first[nt].has(s) && s!=='ε') ll1ok=false; }
    }
    html += `<tr>
      <td><strong style="color:var(--accent3)">${nt}</strong></td>
      <td style="color:var(--accent)">{ ${f1.join(', ')} }</td>
      <td style="color:var(--green)">{ ${f2.join(', ')} }</td>
      <td>${ll1ok?'<span style="color:var(--green)">✅ Yes</span>':'<span style="color:var(--red)">❌ No</span>'}</td>
    </tr>`;
  }
  html += '</tbody></table></div></div>';

  // Visual card grid
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">`;
  for(const nt of nonTerminals) {
    const f1 = [...first[nt]].sort();
    const f2 = [...follow[nt]].sort();
    html += `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px">
      <div style="font-size:14px;font-weight:800;color:var(--accent3);margin-bottom:8px">${nt}</div>
      <div style="font-size:11px;text-transform:uppercase;color:var(--accent);letter-spacing:.06em;margin-bottom:3px">FIRST</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);background:rgba(59,130,246,.07);padding:5px 8px;border-radius:4px;margin-bottom:8px">{ ${f1.join(', ')} }</div>
      <div style="font-size:11px;text-transform:uppercase;color:var(--green);letter-spacing:.06em;margin-bottom:3px">FOLLOW</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);background:rgba(16,185,129,.07);padding:5px 8px;border-radius:4px">{ ${f2.join(', ')} }</div>
    </div>`;
  }
  html += '</div>';

  // Step-by-step FIRST derivation
  if(firstSteps.length) {
    html += `<div style="margin-bottom:14px">
      <div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:8px;font-weight:700">🔍 FIRST Set — Step by Step</div>
      <div style="display:flex;flex-direction:column;gap:6px">`;
    firstSteps.slice(0,30).forEach((s,i) => {
      html += `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 10px;background:rgba(59,130,246,.04);border:1px solid rgba(59,130,246,.1);border-radius:6px;font-size:12px">
        <span style="color:var(--text3);min-width:20px">${i+1}.</span>
        <span style="color:var(--accent2);font-family:'JetBrains Mono',monospace;min-width:60px">${s.nt}</span>
        <span style="color:var(--text2)">add <strong style="color:var(--accent)">'${s.sym}'</strong> — ${s.reason}</span>
      </div>`;
    });
    if(firstSteps.length > 30) html += `<div style="color:var(--text3);font-size:12px;padding:4px 10px">... ${firstSteps.length-30} more steps</div>`;
    html += '</div></div>';
  }

  // Step-by-step FOLLOW derivation
  if(followSteps.length) {
    html += `<div style="margin-bottom:8px">
      <div style="font-size:11px;text-transform:uppercase;color:var(--text3);letter-spacing:.07em;margin-bottom:8px;font-weight:700">🔍 FOLLOW Set — Step by Step</div>
      <div style="display:flex;flex-direction:column;gap:6px">`;
    followSteps.slice(0,30).forEach((s,i) => {
      html += `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 10px;background:rgba(16,185,129,.04);border:1px solid rgba(16,185,129,.1);border-radius:6px;font-size:12px">
        <span style="color:var(--text3);min-width:20px">${i+1}.</span>
        <span style="color:var(--accent3);font-family:'JetBrains Mono',monospace;min-width:60px">${s.nt}</span>
        <span style="color:var(--text2)">add <strong style="color:var(--green)">'${s.sym}'</strong> — ${s.reason}</span>
      </div>`;
    });
    if(followSteps.length > 30) html += `<div style="color:var(--text3);font-size:12px;padding:4px 10px">... ${followSteps.length-30} more steps</div>`;
    html += '</div></div>';
  }

  // Productions recap
  html += `<div style="margin-top:12px;padding:10px 14px;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.15);border-radius:6px">
    <div style="font-size:11px;text-transform:uppercase;color:var(--accent3);letter-spacing:.07em;margin-bottom:6px;font-weight:700">📐 Parsed Grammar</div>`;
  for(const [nt, alts] of Object.entries(prods)) {
    html += `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text2);margin-bottom:2px"><span style="color:var(--accent3)">${nt}</span> → ${alts.map(a=>a.join(' ')).join(' | ')}</div>`;
  }
  html += '</div>';

  out.innerHTML = html;
}

function computeFirstWithSteps(prods, nonTerminals, steps) {
  const first = {};
  [...nonTerminals].forEach(nt => first[nt] = new Set());
  let changed = true;
  while(changed) {
    changed = false;
    for(const nt of nonTerminals) {
      for(const alt of (prods[nt]||[])) {
        let allEps = true;
        for(const sym of alt) {
          if(sym==='ε') {
            if(!first[nt].has('ε')) { first[nt].add('ε'); changed=true; steps.push({nt,sym:'ε',reason:`production ${nt}→ε directly`}); }
            break;
          } else if(!nonTerminals.has(sym)) {
            if(!first[nt].has(sym)) { first[nt].add(sym); changed=true; steps.push({nt,sym,reason:`'${sym}' is terminal in production ${nt}→${alt.join(' ')}`}); }
            allEps=false; break;
          } else {
            const before = first[nt].size;
            for(const s of first[sym]) {
              if(s!=='ε' && !first[nt].has(s)) { first[nt].add(s); changed=true; steps.push({nt,sym:s,reason:`from FIRST(${sym}) in production ${nt}→${alt.join(' ')}`}); }
            }
            if(!first[sym].has('ε')) { allEps=false; break; }
          }
        }
        if(allEps && !first[nt].has('ε')) { first[nt].add('ε'); changed=true; steps.push({nt,sym:'ε',reason:`all symbols in ${alt.join(' ')} can derive ε`}); }
      }
    }
  }
  return first;
}

function computeFollowWithSteps(prods, nonTerminals, startSymbol, first, steps) {
  const follow = {};
  [...nonTerminals].forEach(nt => follow[nt] = new Set());
  follow[startSymbol].add('$');
  steps.push({nt:startSymbol, sym:'$', reason:`${startSymbol} is the start symbol`});
  let changed = true;
  while(changed) {
    changed = false;
    for(const nt of nonTerminals) {
      for(const alt of (prods[nt]||[])) {
        for(let i=0;i<alt.length;i++) {
          const B = alt[i];
          if(!nonTerminals.has(B)) continue;
          const beta = alt.slice(i+1);
          let firstBeta = computeFirstOfString(beta, first, nonTerminals);
          for(const s of firstBeta) {
            if(s!=='ε' && !follow[B].has(s)) { follow[B].add(s); changed=true; steps.push({nt:B,sym:s,reason:`FIRST(${beta.join(' ')||'ε'}) in production ${nt}→${alt.join(' ')}`}); }
          }
          if(firstBeta.has('ε') || beta.length===0) {
            for(const s of follow[nt]) {
              if(!follow[B].has(s)) { follow[B].add(s); changed=true; steps.push({nt:B,sym:s,reason:`FOLLOW(${nt}) propagated — β derives ε in ${nt}→${alt.join(' ')}`}); }
            }
          }
        }
      }
    }
  }
  return follow;
}
document.querySelectorAll('.nav-item').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  });
});

