/**
 * Initial document dataset for AI Study Hub.
 */
export const initialDocuments = [
  {
    id: 'doc_physics',
    name: 'Quantum Physics Notes.pdf',
    uploadedAt: '2023-10-14T08:00:00Z',
    size: '12.4 MB',
    type: 'pdf',
    content: `Vật lý Lượng tử - Chương 4: Ghi chú Tiên đề về Hàm sóng và Phương trình vi phân Schrödinger.\n\nHàm sóng Ψ(x,t) đại diện cho trạng thái lượng tử của hạt vi mô chuyển động trong không gian. Nó được tìm ra bởi nhà vật lý Erwin Schrödinger năm 1926.\n\nCác tính chất cốt lõi cần ghi nhớ:\n1. Bình phương biên độ của nó |Ψ|² có ý nghĩa vật lý trực quan nhất: biểu diễn mật độ xác suất tìm thấy hạt tại điểm x vào thời điểm t.\n2. Do xác suất tìm thấy hạt trong toàn bộ không gian là 100%, tích phân chuẩn hóa luôn được bảo toàn: ∫ |Ψ(x,t)|² dx = 1.\n3. Toán tử vi phân thế năng động năng tuyến tính liên hợp Hamiltonian Ĥ đóng vai trò quyết định chuyển động tổng thể.\n\nHãy yêu cầu Trợ lý AI thực hiện tóm tắt nâng cao hoặc ra các đề bài tập giải chi tiết liên quan tới giếng thế vô hạn một chiều!`,
  },
  {
    id: 'doc_ai_advanced',
    name: 'Giáo trình AI Nâng Cao.pdf',
    uploadedAt: '2023-10-14T14:30:00Z',
    size: '12.4 MB',
    type: 'pdf',
    content: `Giáo trình lý thuyết Trí tuệ nhân tạo (AI) và Học máy (Machine Learning) nâng cao học học viện năm thứ 4.\n\nChương 1: Mạng nơ-ron tích chập (Convolutional Neural Networks - CNN) xử lý tín hiệu hình ảnh thông qua các lớp Filter trích lọc biên cạnh đặc trưng.\nChương 2: Cơ chế Attention (Chú ý tự động) mở đường cho sự phát triển của kiến trúc Transformer đột phá trong xử lý chuỗi và ngôn ngữ tự nhiên.\nChương 3: Phân tích nguyên lý của Generative AI và LLMs, cơ chế Tokenizer, phân rã vế từ vựng và tối ưu hóa xác suất dự đoán từ tiếp theo trong câu.`,
  },
  {
    id: 'doc_ml_ex',
    name: 'Bai tap Machine Learning.docx',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    size: '2.1 MB',
    type: 'docx',
    content: `Bài tập thực hành Học máy chương 2 phần Hồi quy phân loại (Classification) nhóm nam học lý thuyết.\n\nYêu cầu sinh viên thực hiện:\n1. Thu thập bộ dữ liệu Dataset chuẩn và làm sạch (Data cleaning).\n2. Xây dựng giải thuật hồi quy logistic (Logistic Regression), tối ưu hóa tham số thông qua cập nhật độ dốc ngược hướng cực tiểu (Gradient Descent).\n3. Đánh giá chất lượng của mô hình thông qua biểu diễn ma trận nhầm lẫn (Confusion Matrix), các chỉ số chính: Độ chính xác (Accuracy), Độ nhạy (Recall), Điểm F1-Score.\n4. Trình bày kèm đồ thị biểu diễn đường biên phân loại rõ ràng dưới dạng định dạng Jupyter Notebook.`,
  },
  {
    id: 'doc_iris_xlsx',
    name: 'Dataset_Iris_Clean.xlsx',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    size: '850 KB',
    type: 'xlsx',
    content: `Bảng dữ liệu đo lường 150 mẫu hoa lan đuôi ngựa Iris nổi tiếng trong học thuật thống kê.\n\nCấu trúc bảng bao gồm các cột:\nCột 1: Sepal length (Chiều dài lá đài - cm)\nCột 2: Sepal width (Chiều rộng lá đài - cm)\nCột 3: Petal length (Chiều dài cánh hoa - cm)\nCột 4: Petal width (Chiều rộng cánh hoa - cm)\nCột 5: Species (Loài hoa: setosa, versicolor, virginica)\n\nDữ liệu được tiền xử lý khử nhiễu hoàn toàn, thích hợp cho học viên kiểm thử các thuật toán phân cụm không giám sát K-means và các mô hình học có giám sát cơ bản Decision Tree.`,
  },
];
