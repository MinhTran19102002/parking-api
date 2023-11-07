# import pytesseract # this is tesseract module 
# import matplotlib.pyplot as plt 
# import cv2 # this is opencv module 
# import glob 
# import os

# gray = cv2.imread("d:/HK1_4/TLCN/project/src/trainModel/image/images.jpg")

# thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADa)


# import cv2
# import pytesseract

# # Đọc hình ảnh biển số xe
# image = cv2.imread("d:/HK1_4/TLCN/project/src/trainModel/image/images.jpg")

# # Chuyển đổi hình ảnh sang ảnh đen trắng để làm nổi bật văn bản
# gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # Sử dụng Tesseract để nhận diện văn bản
# license_plate_text = pytesseract.image_to_string(gray)

# # In kết quả
# print("Biển số xe đã nhận diện:", license_plate_text)