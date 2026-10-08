<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    private function formatExpense(Expense $e)
    {
        return [
            'id' => 'EXP-' . $e->id,
            'db_id' => $e->id,
            'title' => $e->title,
            'amount' => (float) $e->amount,
            'category' => $e->category,
            'date' => $e->date
        ];
    }

    public function index()
    {
        $expenses = Expense::orderBy('date', 'desc')->get()->map(function ($e) {
            return $this->formatExpense($e);
        });

        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'amount' => 'required|numeric'
        ]);

        $expense = Expense::create([
            'title' => trim($request->input('title')),
            'amount' => (float) $request->input('amount'),
            'category' => $request->input('category', 'Utilities'),
            'date' => $request->input('date', date('Y-m-d'))
        ]);

        return response()->json($this->formatExpense($expense), 201);
    }

    public function destroy($id)
    {
        $expId = is_numeric($id) ? (int)$id : (int)str_replace('EXP-', '', $id);
        $expense = Expense::find($expId);
        if ($expense) {
            $expense->delete();
        }

        return response()->json(['message' => 'Expense deleted successfully']);
    }
}
