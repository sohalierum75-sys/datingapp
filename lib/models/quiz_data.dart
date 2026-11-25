class QuizQuestion {
  final String question;
  final List<String> options;

  const QuizQuestion({
    required this.question,
    required this.options,
  });
}

class PhotoQuizSet {
  final int id;
  final String title;
  final String imageUrl;
  final List<QuizQuestion> questions;

  const PhotoQuizSet({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.questions,
  });
}
