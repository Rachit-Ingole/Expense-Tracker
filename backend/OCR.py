import cv2
import numpy as np
import pytesseract


def preprocess_image(img_path):
    img = cv2.imread(img_path)

    # grayscaling
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # resizing
    scale_factor = 3

    gray = cv2.resize(gray, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)

    # Adaptive Thresholding (improves reading quality)
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    # Dilation (thickens the text, useful mostly if serif font)
    kernel = np.ones((1, 1), np.uint8)

    # Erosion (denoises)
    gray = cv2.erode(gray, kernel, iterations=1)

    return gray


def ocr(img_path):
    processed_img = preprocess_image(img_path)

    # Set custom OCR options for better small font recognition
    custom_config = "--oem 3 --psm 6"  # OCR Engine Mode 3 (default), Page Segmentation Mode 6 (assumes a block of text)

    text = pytesseract.image_to_string(processed_img, config=custom_config)
    # return integer cost
    textlist = text.split()
    for i in range(0, len(textlist)):
        if "$" in textlist[i].lower():
            cost = textlist[i]
            cost = cost[1::]
            return cost
        else:
            continue


def cost(text):
    cleaned_text = ""
    try:
        for char in text:
            if char.isdigit() or char in [',', '.']:
                cleaned_text += char
    except TypeError:
        return None
    # Remove commas (handle cases like '1,290' -> '1290')
    cleaned_text = cleaned_text.replace(',', '')
    # Convert to float
    try:
        return float(cleaned_text)
    except ValueError:
        return None


def scan(img_path):
    cst = ocr(img_path)
    return cost(cst)
