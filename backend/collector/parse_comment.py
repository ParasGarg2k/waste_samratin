
def parse_comment(comment):
    check = ["dry","wet","red"]
    i = 0
    out = {
        "wet_waste": {"rating":0, "timestamp":0.0},
        "dry_waste": {"rating":0, "timestamp":0.0},
        "red_waste": {"rating":0, "timestamp":0.0},
        "not_segregated_waste": {"rating":0, "timestamp":0.0}
    }
    while i<len(comment):
        if comment[i][2].lower() in check and (i+1)<len(comment):
            j = i+1
            if j<len(comment):
                while not comment[j][2].isdigit():
                    j+=1
                rating = comment[j][2]
                out[comment[i][2].lower()+"_waste"] = {"rating":rating, "timestamp":(comment[i][0]+comment[j][1])/2}
        elif comment[i][2].lower() == "segregated":
            out["not_segregated_waste"] = {"rating":1, "timestamp":comment[i][0]}
        i+=1
    return out


# sample_input = [
#     [0.0, 1.2, "The"],
#     [1.3, 1.8, "wet"],
#     [1.9, 2.1, "waste"],
#     [2.2, 2.5, "is"],
#     [2.6, 2.9, "3"],
#     [3.0, 3.7, "kilograms"],
#     [4.0, 4.6, "dry"],
#     [4.7, 5.0, "waste"],
#     [5.1, 5.4, "2"],
#     [6.0, 6.8, "red"],
#     [6.9, 7.3, "waste"],
#     [7.4, 7.7, "1"],
#     [8.0, 8.9, "not"],
#     [9.0, 9.8, "segregated"],
#     [10.0, 10.7, "properly"],
#     [11.0, 11.6, "dry"],
#     [11.7, 12.0, "waste"],
#     [12.1, 12.3, "4"]
# ]

# print(parse_comment(sample_input))

'''
{
'wet waste': {'rating': '2', 'timestamp': 3.65}, 
'dry waste': {'rating': '4', 'timestamp': 2.1}, 
'red waste': {'rating': '5', 'timestamp': 5.65}, 
'not segregated': False
}
'''
