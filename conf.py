import openpyxl
import json


def read_config(path):
    data_book = openpyxl.load_workbook('./' + path, read_only=True)
    value1 = read1(data_book.worksheets[0])

    result = {
        "prompts": value1,
        "verification": [],
        "form_container": {
            "locate_method": "querySelector",
            "location": "table"
        },
        "show_condition_for_tooltip": {
            "locate_method": "querySelector",
            "location": "[class='ge-drawer active ge-issue-detail-drawer']"
        }
    }
    with open("config.json", "w+", encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False)


def read1(sheet):
    ############## 提示信息 ################
    # 表头
    row = 2
    ncols = 16
    fieldsKey = []
    for col in range(1, ncols+1):
        fieldsKey.append(sheet.cell(row, col).value)
    # 内容
    fieldsContent = []
    row = 3
    while True:
        if sheet.cell(row, 1).value in ["", None]:
            break
        # 对于每一行数据，与表头组成key-value的形式，对于表头存在重复的，value变为数组
        obj = {}
        for col in range(1, ncols+1):
            key = fieldsKey[col-1]
            value = sheet.cell(row, col).value
            if key not in obj:
                obj[key] = value
            else:
                if type(obj[key]) != type([]):
                    obj[key] = [obj[key]]
                obj[key].append(value)
        row += 1

        # 对于复合元素（表头含有：的字段，values是一个数组），修改表示方式为 prefix:[{body1:'', body2: ''},{body1:'', body2: ''}] 的形式
        for k, vlsit in obj.copy().items():
            if ":" not in k:
                continue

            prefix, body = k.split(":")
            # 初始化，key为prefix，value为n个空对象的数组
            if prefix not in obj:
                obj[prefix] = [{} for _ in range(len(vlsit))]
            # 将原来数组中的每个值，分别以key为body，value为该值的形式，放到对象中
            for idx, item in enumerate(vlsit):
                obj[prefix][idx][body] = item
            # 删除obj中的复合元素
            del (obj[k])

        # for k in keysToDel:
        fieldsContent.append(obj)

    return fieldsContent


if __name__ == '__main__':
    read_config('配置.xlsx')
