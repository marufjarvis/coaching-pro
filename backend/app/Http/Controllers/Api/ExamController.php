<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamMark;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    private function formatExam(Exam $exam)
    {
        $marksMap = [];
        foreach ($exam->marks as $m) {
            $marksMap[$m->student_id] = (float) $m->marks_obtained;
        }

        return [
            'id' => 'EXM-' . $exam->id,
            'db_id' => $exam->id,
            'name' => $exam->name,
            'batch' => $exam->batch,
            'subject' => $exam->subject,
            'date' => $exam->date,
            'totalMarks' => (int) $exam->total_marks,
            'passMarks' => (int) $exam->pass_marks,
            'marks' => $marksMap
        ];
    }

    public function index()
    {
        $exams = Exam::with('marks')->orderBy('created_at', 'desc')->get()->map(function ($e) {
            return $this->formatExam($e);
        });

        return response()->json($exams);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $exam = Exam::create([
            'name' => trim($request->input('name')),
            'batch' => $request->input('batch', 'All Batches'),
            'subject' => $request->input('subject', 'ICT'),
            'date' => $request->input('date', date('Y-m-d')),
            'total_marks' => (int) ($request->input('totalMarks') ?? $request->input('total_marks') ?? 50),
            'pass_marks' => (int) ($request->input('passMarks') ?? $request->input('pass_marks') ?? 40),
        ]);

        return response()->json($this->formatExam($exam->fresh('marks')), 201);
    }

    public function saveMarks(Request $request, $id)
    {
        $examId = is_numeric($id) ? (int)$id : (int)str_replace('EXM-', '', $id);
        $exam = Exam::find($examId);
        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        $marks = $request->input('marks', []);
        foreach ($marks as $studentId => $markValue) {
            if ($markValue !== null && $markValue !== '') {
                ExamMark::updateOrCreate(
                    [
                        'exam_id' => $exam->id,
                        'student_id' => $studentId
                    ],
                    [
                        'marks_obtained' => (float) $markValue
                    ]
                );
            }
        }

        return response()->json($this->formatExam($exam->fresh('marks')));
    }

    public function destroy($id)
    {
        $examId = is_numeric($id) ? (int)$id : (int)str_replace('EXM-', '', $id);
        $exam = Exam::find($examId);
        if ($exam) {
            $exam->marks()->delete();
            $exam->delete();
        }

        return response()->json(['message' => 'Exam deleted successfully']);
    }
}
