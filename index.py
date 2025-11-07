s = input("Enter string: ").lower()

vowel = 0
i = 0
l = len(s)

while i < l:
    if s[i] in "aeiou":
        vowel += 1
    i += 1

print("Number of vowels:", vowel)
