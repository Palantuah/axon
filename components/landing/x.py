from PIL import Image
import numpy as np

# Open the image
img = Image.open('public/scrapybara.png')

# Convert to RGBA if not already
img = img.convert('RGBA')

data = np.array(img)

# Create mask - white pixels become transparent, everything else black
r, g, b, a = data.T
white_areas = (r == 255) & (g == 255) & (b == 255)

# Set non-white pixels to black
data[~white_areas.T] = [0, 0, 0, 255]

# Set white pixels to transparent
data[white_areas.T] = [0, 0, 0, 0]

# Create new image from array
new_img = Image.fromarray(data)

# Save the result
new_img.save('public/scrapybara_bw.png')
