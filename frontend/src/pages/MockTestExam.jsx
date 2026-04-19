import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock, ChevronLeft, ChevronRight, Flag,
  CheckCircle, Circle, ArrowLeft, Trophy,
  XCircle, AlertTriangle, BookmarkCheck, Play,
  Info, BookOpen, Target, Award, Minus,
} from "lucide-react";

const API = "https://examprep360-production.up.railway.app/api";

const MARKING_SCHEME = {
  "JEE Main":     { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks for correct, -1 for wrong" },
  "JEE Advanced": { correct:3,  wrong:-1,    label:"+3 / -1",    description:"3 marks for correct, -1 for wrong" },
  "NEET UG":      { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks for correct, -1 for wrong" },
  "NEET PG":      { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks for correct, -1 for wrong" },
  "AFMC":         { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks for correct, -1 for wrong" },
  "JIPMER":       { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks for correct, -1 for wrong" },
  "BITSAT":       { correct:3,  wrong:-1,    label:"+3 / -1",    description:"3 marks for correct, -1 for wrong" },
  "SRMJEEE":      { correct:3,  wrong:-1,    label:"+3 / -1",    description:"3 marks for correct, -1 for wrong" },
  "CAT":          { correct:3,  wrong:-1,    label:"+3 / -1",    description:"3 marks for correct, -1 for wrong" },
  "XAT":          { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark for correct, -0.25 for wrong" },
  "CMAT":         { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks for correct, -1 for wrong" },
  "MAT":          { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark correct, -0.25 wrong" },
  "NMAT":         { correct:1,  wrong:0,     label:"+1 / 0",     description:"1 mark for correct, no negative marking" },
  "CLAT":         { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark correct, -0.25 wrong" },
  "AILET":        { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark correct, -0.25 wrong" },
  "DU LLB":       { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark correct, -0.25 wrong" },
  "AP LAWCET":    { correct:1,  wrong:0,     label:"+1 / 0",     description:"1 mark correct, no negative marking" },
  "GATE CS":      { correct:1,  wrong:-0.33, label:"+1 / -0.33", description:"1 mark correct, -1/3 for wrong" },
  "NIMCET":       { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks correct, -1 wrong" },
  "CUET PG":      { correct:4,  wrong:-1,    label:"+4 / -1",    description:"4 marks correct, -1 wrong" },
  "IIT JAM":      { correct:1,  wrong:-0.33, label:"+1 / -0.33", description:"1 mark correct, -1/3 wrong" },
  "TANCET":       { correct:1,  wrong:-0.33, label:"+1 / -0.33", description:"1 mark correct, -1/3 wrong" },
  "UPSC CSE":     { correct:2,  wrong:-0.66, label:"+2 / -0.66", description:"2 marks correct, -2/3 wrong" },
  "SSC CGL":      { correct:2,  wrong:-0.5,  label:"+2 / -0.5",  description:"2 marks correct, -0.5 wrong" },
  "IBPS PO":      { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark correct, -0.25 wrong" },
  "RRB NTPC":     { correct:1,  wrong:-0.33, label:"+1 / -0.33", description:"1 mark correct, -1/3 wrong" },
  "VITEEE":       { correct:1,  wrong:0,     label:"+1 / 0",     description:"1 mark correct, no negative marking" },
  "WBJEE":        { correct:1,  wrong:-0.25, label:"+1 / -0.25", description:"1 mark correct, -0.25 wrong" },
};
const DEFAULT_SCHEME = { correct:1, wrong:0, label:"+1 / 0", description:"1 mark for correct answer, no negative marking" };

const Q_STATUS = {
  answered:   "bg-green-500 text-white border-green-500",
  flagged:    "bg-purple-500 text-white border-purple-500",
  visited:    "bg-orange-400 text-white border-orange-400",
  notVisited: "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-600",
};

const getSaveKey  = (e,t) => `mock_progress_${e}_${t}`;
const saveProgress= (e,t,s) => { try { localStorage.setItem(getSaveKey(e,t),JSON.stringify({...s,savedAt:Date.now()})); } catch {} };
const loadProgress= (e,t)   => { try { const r=localStorage.getItem(getSaveKey(e,t)); return r?JSON.parse(r):null; } catch { return null; } };
const clearProgress=(e,t)   => { localStorage.removeItem(getSaveKey(e,t)); };

export default function MockTestExam() {
  const { examName, testNo } = useParams();
  const navigate = useNavigate();
  const decodedExam = decodeURIComponent(examName);
  const scheme      = MARKING_SCHEME[decodedExam] || DEFAULT_SCHEME;

  const [phase, setPhase]         = useState("loading");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState({});
  const [flagged, setFlagged]     = useState({});
  const [visited, setVisited]     = useState({0:true});
  const [timeLeft, setTimeLeft]   = useState(0);
  const [qTimer, setQTimer]       = useState(90);
  const [result, setResult]       = useState(null);
  const [savedProgress, setSavedProgress] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showQuitConfirm,   setShowQuitConfirm]   = useState(false);
  const [activeSubject, setActiveSubject]         = useState("All");
  const autoSaveRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/mock/questions/${encodeURIComponent(decodedExam)}/${testNo}`)
      .then(r=>r.json())
      .then(data => {
        setQuestions(data);
        const saved = loadProgress(decodedExam, testNo);
        if (saved && Object.keys(saved.answers||{}).length > 0) {
          setSavedProgress(saved);
          setPhase("resume");
        } else {
          setPhase("instructions");
        }
      })
      .catch(()=>setPhase("instructions"));
  },[decodedExam, testNo]);

  useEffect(() => {
    if (phase!=="exam") return;
    autoSaveRef.current = setInterval(()=>{
      saveProgress(decodedExam, testNo, {answers,flagged,visited,current,timeLeft});
    },30000);
    return ()=>clearInterval(autoSaveRef.current);
  },[phase, answers, flagged, visited, current, timeLeft]);

  useEffect(() => {
    if (phase!=="exam"||timeLeft<=0) return;
    const t = setInterval(()=>{
      setTimeLeft(p=>{ if(p<=1){handleSubmit();return 0;} return p-1; });
    },1000);
    return ()=>clearInterval(t);
  },[phase, timeLeft]);

  useEffect(() => {
    if (phase!=="exam"||!questions[current]) return;
    setQTimer(questions[current].timer_seconds||90);
    const t = setInterval(()=>setQTimer(p=>p<=1?0:p-1),1000);
    return ()=>clearInterval(t);
  },[current, questions, phase]);

  const startFresh = () => {
    clearProgress(decodedExam, testNo);
    setAnswers({}); setFlagged({}); setVisited({0:true}); setCurrent(0);
    setTimeLeft(questions.length*90);
    setPhase("instructions");
  };

  const resumeTest = () => {
    if(savedProgress){
      setAnswers(savedProgress.answers||{});
      setFlagged(savedProgress.flagged||{});
      setVisited(savedProgress.visited||{0:true});
      setCurrent(savedProgress.current||0);
      setTimeLeft(savedProgress.timeLeft||questions.length*90);
    }
    setPhase("exam");
  };

  const startTest = () => {
    setTimeLeft(questions.length*90);
    setPhase("exam");
  };

  const fmt = s => {
    const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
    if(h>0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const goTo = i => { setCurrent(i); setVisited(p=>({...p,[i]:true})); };
  const selectAnswer = opt => setAnswers(p=>({...p,[current]:opt}));
  const clearAnswer  = ()  => setAnswers(p=>{ const n={...p}; delete n[current]; return n; });
  const toggleFlag   = ()  => setFlagged(p=>({...p,[current]:!p[current]}));

  const getQStatus = i => {
    if(flagged[i])  return "flagged";
    if(answers[i])  return "answered";
    if(visited[i])  return "visited";
    return "notVisited";
  };

  const calcScore = useCallback((qs,ans) => {
    let score=0,correct=0,wrong=0,skipped=0;
    qs.forEach((q,i)=>{
      const sel=ans[i];
      if(!sel) skipped++;
      else if(sel===q.correct_option){correct++;score+=scheme.correct;}
      else{wrong++;score+=scheme.wrong;}
    });
    return {score:Math.round(score*100)/100,correct,wrong,skipped};
  },[scheme]);

  const handleSubmit = useCallback(async () => {
    if (phase === "result") return;
    clearProgress(decodedExam, testNo);
    const { score, correct, wrong, skipped } = calcScore(questions, answers);
    const total_marks = Math.round(questions.length * scheme.correct * 100) / 100;

    const details = questions.map((q, i) => {
      const selected = answers[i];
      let status = "skipped", pts = 0;
      if (selected) {
        if (selected === q.correct_option) { status = "correct"; pts = scheme.correct; }
        else { status = "wrong"; pts = scheme.wrong; }
      }
      return { ...q, selected, status, pts };
    });

    setResult({
      total: questions.length, correct, wrong, skipped, score,
      maxScore: total_marks,
      accuracy: Math.round((correct / questions.length) * 100), details,
    });

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const raw2 = localStorage.getItem("mock_history");
      const hist = raw2 ? JSON.parse(raw2) : [];
      hist.unshift({
        exam: decodedExam,
        testNo,
        score,
        maxScore: total_marks,
        total_marks,
        total_questions: questions.length,
        correct,
        wrong,
        skipped,
        accuracy: Math.round((correct / questions.length) * 100),
        total: questions.length,
        date: new Date().toISOString(),
        scheme: scheme.label,
        userId: currentUser._id || currentUser.id || currentUser.email,
        answers: questions.map((q, i) => ({
          question_text:   q.question_text,
          options:         q.options,
          selected_option: answers[i] || null,
          correct_option:  q.correct_option,
          is_correct:      answers[i] === q.correct_option,
          reason:          q.reason || null,
          subject:         q.subject || null,
        })),
      });
      localStorage.setItem("mock_history", JSON.stringify(hist.slice(0, 50)));
    } catch {}

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user._id) {
        const EXAM_CATEGORY_MAP = {
          "JEE Main": "Engineering", "JEE Advanced": "Engineering",
          "BITSAT": "Engineering", "VITEEE": "Engineering",
          "SRMJEEE": "Engineering", "WBJEE": "Engineering",
          "NEET UG": "Medical", "NEET PG": "Medical",
          "JIPMER": "Medical", "AFMC": "Medical",
          "CAT": "Management", "XAT": "Management",
          "CMAT": "Management", "MAT": "Management", "NMAT": "Management",
          "GATE CS": "Computer Science", "NIMCET": "Computer Science",
          "CUET PG": "Computer Science", "IIT JAM": "Computer Science",
          "TANCET": "Computer Science",
          "CLAT": "Law", "AILET": "Law",
          "DU LLB": "Law", "AP LAWCET": "Law",
          "UPSC CSE": "Government", "SSC CGL": "Government",
          "IBPS PO": "Government", "RRB NTPC": "Government",
        };

        await fetch(`${API}/reports/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id:         user._id,
            exam_name:       decodedExam,
            test_no:         parseInt(testNo),
            category:        EXAM_CATEGORY_MAP[decodedExam] || "Other",
            score:           score,
            total_marks:     total_marks,
            total_questions: questions.length,
            marking_scheme:  scheme.label,
            answers: questions.map((q, i) => ({
              question_text:   q.question_text,
              selected_option: answers[i] || null,
              correct_option:  q.correct_option,
              is_correct:      answers[i] === q.correct_option,
            })),
          }),
        });
      }
    } catch (err) {
      console.error("Failed to save result to DB:", err);
    }

    setShowSubmitConfirm(false);
    setPhase("result");
  }, [questions, answers, calcScore, decodedExam, testNo, scheme, phase]);

  const handleQuit = ()=>{
    saveProgress(decodedExam,testNo,{answers,flagged,visited,current,timeLeft});
    navigate(`/mock-test/${encodeURIComponent(decodedExam)}`);
  };

  const subjects=["All",...new Set(questions.map(q=>q.subject).filter(Boolean))];
  const answered=Object.keys(answers).length;

  // ── LOADING ──
  if(phase==="loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
      </div>
    </div>
  );

  // ── RESUME PROMPT ──
  if(phase==="resume"&&savedProgress) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <BookmarkCheck className="w-14 h-14 text-blue-500 mx-auto mb-4"/>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">Resume Test?</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
          You have a saved attempt for <strong>{decodedExam} — Test {testNo}</strong>
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Saved on:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(savedProgress.savedAt).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Answered:</span>
            <span className="font-semibold text-green-600">{Object.keys(savedProgress.answers||{}).length}/{questions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Time remaining:</span>
            <span className="font-semibold text-blue-600">{fmt(savedProgress.timeLeft||0)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={startFresh}
            className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Start Fresh
          </button>
          <button onClick={resumeTest}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2">
            <Play className="w-4 h-4"/> Resume
          </button>
        </div>
      </div>
    </div>
  );

  // ── INSTRUCTIONS PAGE ──
  if(phase==="instructions") return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Info className="w-4 h-4"/> Read Instructions Before Starting
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-1">{decodedExam}</h1>
          <p className="text-gray-500 dark:text-gray-400">Mock Test {testNo} · {questions.length} Questions</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon:<BookOpen className="w-5 h-5 text-blue-500"/>, label:"Questions",    value:questions.length },
            { icon:<Clock    className="w-5 h-5 text-orange-500"/>,label:"Time Limit",  value:fmt(questions.length*90) },
            { icon:<Award    className="w-5 h-5 text-green-500"/>, label:"Max Marks",   value:Math.round(questions.length*scheme.correct) },
          ].map(s=>(
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-5">
          <h2 className="font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500"/> Marking Scheme
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-600">+{scheme.correct}</p>
              <p className="text-xs text-green-700 dark:text-green-400 font-semibold mt-1">Correct Answer</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-red-600">{scheme.wrong}</p>
              <p className="text-xs text-red-700 dark:text-red-400 font-semibold mt-1">Wrong Answer</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-gray-500 dark:text-gray-300">0</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">Unattempted</p>
            </div>
          </div>
          {scheme.wrong < 0 && (
            <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Negative Marking applies!</strong> Wrong answer will deduct {Math.abs(scheme.wrong)} mark(s).
                Attempt only if you are confident. Leaving a question unanswered is safer than a wrong guess.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-5">
          <h2 className="font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500"/> General Instructions
          </h2>
          <div className="space-y-2.5">
            {[
              "The test contains Multiple Choice Questions (MCQs) — each has exactly one correct answer.",
              "Click on any option to select it. You can change your answer anytime before submission.",
              "Use Previous / Next buttons or the Question Palette to navigate between questions.",
              "Click the Flag icon (🚩) to mark a question for review — you can revisit it later.",
              `Each question has a ${questions[0]?.timer_seconds||90}-second individual timer to track your speed.`,
              "Your progress is auto-saved every 30 seconds — you can resume if you leave accidentally.",
              "Once you click 'Submit Test', the test ends and cannot be re-attempted.",
              "Your result with detailed answer review will be shown immediately after submission.",
            ].map((ins,i)=>(
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i+1}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{ins}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
          <h2 className="font-black text-gray-900 dark:text-gray-100 mb-4">Question Status Legend</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["bg-green-500","Answered","Question has been answered"],
              ["bg-purple-500","Flagged for Review","Marked to revisit later"],
              ["bg-orange-400","Visited (Not Answered)","Opened but not answered"],
              ["bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-500","Not Visited","Not yet opened"],
            ].map(([color,label,desc])=>(
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${color} flex-shrink-0`}/>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={startTest}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl
                     font-black text-lg hover:opacity-90 transition shadow-xl shadow-blue-200
                     flex items-center justify-center gap-3">
          <Play className="w-6 h-6"/> Start Mock Test
        </button>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
          By starting, you agree to attempt the test honestly
        </p>
      </div>
    </div>
  );

  // ── RESULT ──
  if(phase==="result"&&result) {
    const gradeBg = result.accuracy>=80?"from-green-500 to-emerald-600"
      :result.accuracy>=60?"from-blue-500 to-indigo-600"
      :result.accuracy>=40?"from-yellow-500 to-orange-500"
      :"from-red-500 to-rose-600";
    const gradeMsg = result.accuracy>=80?"Excellent! 🎉":result.accuracy>=60?"Good Job! 💪":result.accuracy>=40?"Keep Going! 📚":"Need Practice! 🔁";

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className={`bg-gradient-to-r ${gradeBg} py-12 px-4 text-white text-center`}>
          <Trophy className="w-14 h-14 mx-auto mb-3 opacity-90"/>
          <h1 className="text-4xl font-black mb-1">{gradeMsg}</h1>
          <p className="text-white/70 text-sm">{decodedExam} · Mock Test {testNo} · {scheme.label}</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              {label:"Score",    value:`${result.score}/${result.maxScore}`, color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/20"},
              {label:"Correct",  value:result.correct,                        color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/20"},
              {label:"Wrong",    value:result.wrong,                          color:"text-red-600",    bg:"bg-red-50 dark:bg-red-900/20"},
              {label:"Skipped",  value:result.skipped,                        color:"text-gray-500",   bg:"bg-gray-100 dark:bg-gray-800"},
              {label:"Accuracy", value:`${result.accuracy}%`,                 color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/20"},
            ].map(c=>(
              <div key={c.label} className={`${c.bg} rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700 shadow-sm`}>
                <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{width:`${(result.correct/result.total)*100}%`}}/>
              <div className="bg-red-400 h-full"   style={{width:`${(result.wrong/result.total)*100}%`}}/>
              <div className="bg-gray-300 dark:bg-gray-600 h-full"  style={{width:`${(result.skipped/result.total)*100}%`}}/>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-green-600 font-semibold">✓ {result.correct} Correct (+{result.correct*scheme.correct})</span>
              <span className="text-red-500 font-semibold">✗ {result.wrong} Wrong ({result.wrong*scheme.wrong})</span>
              <span className="text-gray-400">— {result.skipped} Skipped</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-black text-gray-900 dark:text-gray-100 text-lg">Detailed Answer Review</h2>
              <p className="text-xs text-gray-400 mt-0.5">Review answers with explanations</p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[700px] overflow-y-auto">
              {result.details.map((q,i)=>(
                <div key={i} className={`p-5 ${q.status==="correct"?"bg-green-50 dark:bg-green-900/10":q.status==="wrong"?"bg-red-50 dark:bg-red-900/10":"bg-gray-50 dark:bg-gray-800/50"}`}>
                  <div className="flex items-start gap-3">
                    {q.status==="correct"?<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                    :q.status==="wrong"  ?<XCircle     className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                    :                    <Circle       className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"/>}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-400">Q{i+1}</span>
                        {q.subject&&<span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{q.subject}</span>}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                          ${q.status==="correct"?"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          :q.status==="wrong"  ?"bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          :"bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                          {q.status==="correct"?`+${scheme.correct}`:q.status==="wrong"?`${scheme.wrong}`:"Skipped"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-3">{q.question_text}</p>

                      <div className="grid gap-1.5 mb-3">
                        {q.options?.map((opt,oi)=>(
                          <div key={oi} className={`text-xs px-3 py-2 rounded-lg border font-medium
                            ${opt===q.correct_option?"bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300"
                            :opt===q.selected&&q.status==="wrong"?"bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300"
                            :"bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"}`}>
                            {opt===q.correct_option&&"✓ "}
                            {opt===q.selected&&q.status==="wrong"&&"✗ "}
                            {opt}
                          </div>
                        ))}
                      </div>

                      {q.reason && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-0.5">Explanation</p>
                            <p className="text-xs text-blue-800 dark:text-blue-300">{q.reason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={()=>navigate(`/mock-test/${encodeURIComponent(decodedExam)}`)}
              className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Try Another Test
            </button>
            <button onClick={()=>navigate("/free-tests")}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700">
              All Mock Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EXAM INTERFACE ──
  if(!questions.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">No questions found</p>
    </div>
  );
  const q=questions[current];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">

      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowQuitConfirm(true)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 p-1">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <div>
              <h1 className="font-black text-gray-900 dark:text-gray-100 text-sm">{decodedExam}</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Test {testNo} · {scheme.label}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-lg
            ${timeLeft<300?"bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse":"bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"}`}>
            <Clock className="w-5 h-5"/>
            {fmt(timeLeft)}
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-green-600 font-bold">
              <CheckCircle className="w-3.5 h-3.5"/> {answered} Answered
            </span>
            <span className="text-gray-400">{questions.length-answered} Remaining</span>
          </div>
          <button onClick={()=>setShowSubmitConfirm(true)}
            className="px-5 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700">
            Submit
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-5 flex gap-5">

        {/* Question */}
        <div className="flex-1 min-w-0">
          {subjects.length>2&&(
            <div className="flex flex-wrap gap-2 mb-4">
              {subjects.map(s=>(
                <button key={s} onClick={()=>setActiveSubject(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition
                    ${activeSubject===s?"bg-blue-600 text-white":"bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-semibold">Q{current+1}/{questions.length}</span>
                {q.subject&&<span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-semibold">{q.subject}</span>}
                {q.difficulty&&(
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold
                    ${q.difficulty==="High"?"bg-red-100 dark:bg-red-900/30 text-red-600":q.difficulty==="Medium"?"bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600":"bg-green-100 dark:bg-green-900/30 text-green-600"}`}>
                    {q.difficulty}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                  ${qTimer<20?"bg-red-100 dark:bg-red-900/30 text-red-600":"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                  ⏱ {qTimer}s
                </span>
                <button onClick={toggleFlag}
                  className={`p-2 rounded-lg transition
                    ${flagged[current]?"bg-purple-100 dark:bg-purple-900/30 text-purple-600":"bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}>
                  <Flag className="w-4 h-4"/>
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-base leading-relaxed mb-6">{q.question_text}</p>
              <div className="space-y-3">
                {q.options?.map((opt,i)=>{
                  const isSelected=answers[current]===opt;
                  return (
                    <button key={i} onClick={()=>selectAnswer(opt)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left
                                 transition-all duration-150 font-medium text-sm
                        ${isSelected
                          ?"border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                          :"border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"}`}>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                        ${isSelected?"bg-blue-500 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                        {["A","B","C","D"][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <button onClick={clearAnswer}
                className="text-xs text-gray-400 hover:text-red-500 transition underline">
                Clear Response
              </button>
              <div className="flex gap-3">
                <button onClick={()=>goTo(Math.max(0,current-1))} disabled={current===0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4"/> Prev
                </button>
                <button onClick={()=>goTo(Math.min(questions.length-1,current+1))} disabled={current===questions.length-1}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40">
                  Next <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Question Palette</h3>
            </div>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 space-y-1.5">
              {[
                ["bg-green-500","Answered"],
                ["bg-orange-400","Visited (Not Answered)"],
                ["bg-purple-500","Flagged"],
                ["bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-500","Not Visited"]
              ].map(([c,l])=>(
                <div key={l} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className={`w-4 h-4 rounded-sm ${c}`}/>{l}
                </div>
              ))}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((_,i)=>(
                  <button key={i} onClick={()=>goTo(i)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold border transition
                      ${current===i?"ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900":""}
                      ${Q_STATUS[getQStatus(i)]}`}>
                    {i+1}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4 space-y-1 text-xs">
              {[
                ["Answered:",answered,"text-green-600"],
                ["Not Answered:",Object.keys(visited).length-answered,"text-orange-500"],
                ["Not Visited:",questions.length-Object.keys(visited).length,"text-gray-500 dark:text-gray-400"]
              ].map(([l,v,c])=>(
                <div key={l} className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{l}</span>
                  <span className={`font-bold ${c}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirm */}
      {showSubmitConfirm&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4"/>
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 text-center mb-5">Submit Test?</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Answered:</span>
                <span className="font-bold text-green-600">{answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Unanswered:</span>
                <span className="font-bold text-red-500">{questions.length-answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Flagged:</span>
                <span className="font-bold text-purple-500">{Object.keys(flagged).filter(k=>flagged[k]).length}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowSubmitConfirm(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Continue
              </button>
              <button onClick={handleSubmit}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700">
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quit Confirm */}
      {showQuitConfirm&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 text-center mb-2">Leave Test?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
              Your progress will be <span className="font-semibold text-blue-600">saved automatically</span>. You can resume later.
            </p>
            <div className="flex gap-3">
              <button onClick={()=>setShowQuitConfirm(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300">
                Stay
              </button>
              <button onClick={handleQuit}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600">
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}