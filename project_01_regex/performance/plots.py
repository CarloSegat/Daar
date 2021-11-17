import matplotlib.pyplot as plt

egrep = [[17.981409, 29.132129,
           31.068204, 10.337787,
           24.579891, 21.240914,
           19.389113,  29.78245],
             [11.6934,  8.485406,
           12.151965, 10.689674,
            9.442589,  7.669533,
            7.936333, 12.271579]

]
me = [ [135.275605, 179.167025,
        322.809909, 259.390416,
        278.487379, 121.798565,
        119.611661, 199.611716],
         [68.844862,  69.334203,
        248.579358, 165.239019,
        121.129257,  61.028649,
         67.821428,  91.555013]
]
import numpy as np
print(np.mean(egrep[0]))
print(np.mean(egrep[1]))

print(np.mean(me[0]))
print(np.mean(me[1]))

regexes = ["Sargon", "random_string_wont_be_present_54gbh",
             "Nabop.las*ar|Sargon|t(he)* best", "Nabop.las*ar",
             "Nabop.las*ar|Sargon", "himself", '(W|w)', "of the gate was in progress,\n and there are traces of two temporary"]

plt.plot(egrep[1], color='red')
plt.plot(me[1], color='blue')

plt.legend(['Egrep performance', 'My program'], loc='upper right')

plt.ylabel('Milliseconds', fontsize=12)

plt.xticks(range(0,len(regexes)), regexes, fontsize=8)
plt.yticks(range(0,340, 8), fontsize=6)
plt.xticks(rotation=45, ha='right')
plt.subplots_adjust(bottom=0.4)

plt.show()
