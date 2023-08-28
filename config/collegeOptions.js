const colleges = [
    {
        text: "Indian Institute of Information Technology Allahabad",
        value: "iiita",
        key: "iiita"
    },
    {
        text: "Indian Institute of Information Technology and Management Gwalior",
        value: "iiitmg",
        key: "iiitmg"
    },
    {
        text: "Indian Institute of Information Technology, Design and Manufacturing",
        value: "iiitdm",
        key: "iiitdm"
    },
    {
        text: "Indian Institute of Information Technology, Guwahati",
        value: "iiitg",
        key: "iiitg"
    },
    {
        text: "Indian Institute of Information Technology, Kalyani",
        value: "iiitkl",
        key: "iiitkl"
    },
    {
        text: "Indian Institute of Information Technology, Kottayam",
        value: "iiitk",
        key: "iiitk"
    },
    {
        text: "Indian Institute of Information Technology, Lucknow",
        value: "iiitl",
        key: "iiitl"
    },
    {
        text: "Indian Institute of Information Technology, Manipur",
        value: "iiitm",
        key: "iiitm"
    },
    {
        text: "Indian Institute of Information Technology, Sri City",
        value: "iiits",
        key: "iiits"
    },
    {
        text: "Indian Institute of Information Technology, Una",
        value: "iiitu",
        key: "iiitu"
    },
    {
        text: "Indian Institute of Information Technology, Vadodara",
        value: "iiitv",
        key: "iiitv"
    },
    {
        text: "Indian Institute of Technology Bhubaneswar",
        value: "iitbh",
        key: "iitbh"
    },
    {
        text: "Indian Institute of Technology Bombay",
        value: "iitb",
        key: "iitb"
    },
    {
        text: "Indian Institute of Technology Delhi",
        value: "iitd",
        key: "iitd"
    },
    {
        text: "Indian Institute of Technology Gandhinagar",
        value: "iitg",
        key: "iitg"
    },
    {
        text: "Indian Institute of Technology Guwahati",
        value: "iitgu",
        key: "iitgu"
    },
    {
        text: "Indian Institute of Technology Hyderabad",
        value: "iith",
        key: "iith"
    },
    {
        text: "Indian Institute of Technology Indore",
        value: "iiti",
        key: "iiti"
    },
    {
        text: "Indian Institute of Technology Jodhpur",
        value: "iitj",
        key: "iitj"
    },
    {
        text: "Indian Institute of Technology Kanpur",
        value: "iitk",
        key: "iitk"
    },
    {
        text: "Indian Institute of Technology Kharagpur",
        value: "iitkh",
        key: "iitkh"
    },
    {
        text: "Indian Institute of Technology Madras",
        value: "iitm",
        key: "iitm"
    },
    {
        text: "Indian Institute of Technology Mandi",
        value: "iitma",
        key: "iitma"
    },
    {
        text: "Indian Institute of Technology Patna",
        value: "iitp",
        key: "iitp"
    },
    {
        text: "Indian Institute of Technology Roorkee",
        value: "iitr",
        key: "iitr"
    },
    {
        text: "Indian Institute of Technology Ropar",
        value: "iitro",
        key: "iitro"
    },
    {
        text: "Indian Institute of Technology, BHU",
        value: "iitbhu",
        key: "iitbhu"
    },
    {
        text: "National Institute of Technology, Agartala",
        value: "nita",
        key: "nita"
    },
    {
        text: "National Institute of Technology, Arunachal Pradesh",
        value: "nitap",
        key: "nitap"
    },
    {
        text: "National Institute of Technology, Calicut",
        value: "nitc",
        key: "nitc"
    },
    {
        text: "National Institute of Technology, Delhi",
        value: "nitd",
        key: "nitd"
    },
    {
        text: "National Institute of Technology, Durgapur",
        value: "nitdu",
        key: "nitdu"
    },
    {
        text: "National Institute of Technology, Goa",
        value: "nitg",
        key: "nitg"
    },
    {
        text: "National Institute of Technology, Hamirpur",
        value: "nith",
        key: "nith"
    },
    {
        text: "National Institute of Technology, Jamshedpur",
        value: "nitj",
        key: "nitj"
    },
    {
        text: "National Institute of Technology, Karnataka",
        value: "nitk",
        key: "nitk"
    },
    {
        text: "National Institute of Technology, Kurukshetra",
        value: "nitku",
        key: "nitku"
    },
    {
        text: "National Institute of Technology, Manipur",
        value: "nitm",
        key: "nitm"
    },
    {
        text: "National Institute of Technology, Meghalaya",
        value: "nitme",
        key: "nitme"
    },
    {
        text: "National Institute of Technology, Mizoram",
        value: "nitmi",
        key: "nitmi"
    },
    {
        text: "National Institute of Technology, Nagaland",
        value: "nitn",
        key: "nitn"
    },
    {
        text: "National Institute of Technology, Patna",
        value: "nitp",
        key: "nitp"
    },
    {
        text: "National Institute of Technology, Puducherry",
        value: "nitpu",
        key: "nitpu"
    },
    {
        text: "National Institute of Technology, Raipur",
        value: "nitr",
        key: "nitr"
    },
    {
        text: "National Institute of Technology, Rourkela",
        value: "nitro",
        key: "nitro"
    },
    {
        text: "National Institute of Technology, Sikkim",
        value: "nits",
        key: "nits"
    },
    {
        text: "National Institute of Technology, Silchar",
        value: "nitsi",
        key: "nitsi"
    },
    {
        text: "National Institute of Technology, Srinagar",
        value: "nitsr",
        key: "nitsr"
    },
    {
        text: "National Institute of Technology, Tiruchirappalli",
        value: "nitt",
        key: "nitt"
    },
    {
        text: "National Institute of Technology, Uttarakhand",
        value: "nitu",
        key: "nitu"
    },
    {
        text: "National Institute of Technology, Warangal",
        value: "nitw",
        key: "nitw"
    },
    {
        text: "Shoolini University",
        value: "shlni",
        key: "shlni"
    }
]
module.exports =function(){
    keys = colleges.reduce(function (acc, cur, i) {
        acc[cur.key] = cur;
        return acc;
    }, {})
    return {
        options: colleges,
        keys
    }
    
}();