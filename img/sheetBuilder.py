import Image
import ImageDraw
import ImageFile
import os

name = ""
folder = "C:\\Users\\A.Colton\\Desktop\\zombie_game\\img\\hero\\"
frames = 51
states = 8
sheetName = "walking"
spriteWidth = 60
spriteHeight = 80

sheetWidth = spriteWidth * frames
sheetHeight = spriteHeight * states
sheet = Image.new("RGBA",(sheetWidth,sheetHeight))

for frame in range(frames):
  for state in range(states):
    fileName = "%02d_%02d%s.png" % (state, frame, name)
    fp = open(folder + fileName, "rb")
    p = ImageFile.Parser()
    while 1:
      s = fp.read(1024)
      if not s:
        break
      p.feed(s)
    sprite = p.close()
    fp.close()
    sheet.paste(sprite, (spriteWidth*frame, spriteHeight*state))
sheet.save(sheetName+".png", "PNG")